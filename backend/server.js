// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json()); // parse JSON bodies
app.use(cors());

// ----------------- MONGODB CONNECTION -----------------
mongoose
  .connect("mongodb://127.0.0.1:27017/pickleball", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// ----------------- MODELS -----------------

// Team model
const TeamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  players: [String],
  points: { type: Number, default: 0 }, // tournament points
});
const Team = mongoose.model("Team", TeamSchema);

// Round model
const RoundSchema = new mongoose.Schema({
  roundNumber: { type: Number, required: true },
  matches: [
    {
      team1: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
      team2: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
      score1: { type: Number, default: 0 },
      score2: { type: Number, default: 0 },
      winner: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
    },
  ],
});
const Round = mongoose.model("Round", RoundSchema);

// ----------------- TEAM CRUD -----------------

// Create Team
app.post("/teams", async (req, res) => {
  const { name, players } = req.body;
  if (!name || !players)
    return res.status(400).send({ message: "Name and players required" });
  const team = new Team({ name, players });
  await team.save();
  res.send(team);
});

// Get all teams
app.get("/teams", async (req, res) => {
  console.log("GET");
  const teams = await Team.find();
  res.send(teams);
});

// Update team
app.put("/teams/:id", async (req, res) => {
  const team = await Team.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.send(team);
});

// Delete team
app.delete("/teams/:id", async (req, res) => {
  await Team.findByIdAndDelete(req.params.id);
  res.send({ message: "Deleted" });
});

// ----------------- ROUND ROUTES -----------------
app.post("/rounds/start/1", async (req, res) => {
  try {
    // 1️⃣ Remove all existing rounds
    await Round.deleteMany({});

    // 2️⃣ Reset points of all teams to 0
    await Team.updateMany({}, { $set: { points: 0 } });

    // 3️⃣ Fetch all teams
    const teams = await Team.find();
    if (teams.length < 2) {
      return res
        .status(400)
        .send({ message: "Not enough teams to start tournament" });
    }

    // 4️⃣ Shuffle teams for random pairing
    const shuffled = teams.sort(() => Math.random() - 0.5);

    // 5️⃣ Create matches for round 1
    const matches = [];
    for (let i = 0; i < shuffled.length; i += 2) {
      if (i + 1 < shuffled.length) {
        matches.push({
          team1: shuffled[i]._id,
          team2: shuffled[i + 1]._id,
          score1: 0,
          score2: 0,
          winner: null,
        });
      } else {
        // Odd number of teams → last team gets a bye
        matches.push({
          team1: shuffled[i]._id,
          team2: null,
          score1: 0,
          score2: 0,
          winner: shuffled[i]._id,
        });
      }
    }

    // 6️⃣ Save round 1
    const round = new Round({
      roundNumber: 1,
      matches,
    });

    await round.save();
    res
      .status(201)
      .json({ message: "First round created successfully!", round });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


// Start a round with Swiss pairing
app.post("/rounds/start/:roundNumber", async (req, res) => {
  const roundNumber = parseInt(req.params.roundNumber);

  const existingRound = await Round.findOne({ roundNumber });
  if (existingRound) {
    return res.status(400).send({
      message: `Round ${roundNumber} already exists`,
    });
  }

  // Check previous round completion
  if (roundNumber > 1) {
    const prevRound = await Round.findOne({ roundNumber: roundNumber - 1 });
    if (!prevRound || prevRound.matches.some((m) => !m.winner)) {
      console.log("prevRound", prevRound);
      console.log("prevRound.matches", prevRound.matches);
      console.log(
        "prevRound.matches.some",
        prevRound.matches.some((m) => !m.winner)
      );
      console.log(
        "prevRound.matches.some((m) => !m.winner)",
        prevRound.matches.some((m) => !m.winner)
      );
      console.log(
        "prevRound.matches.some((m) => !m.winner)",
        prevRound.matches.some((m) => !m.winner)
      );
      return res.status(400).send({
        message: `Cannot start Round ${roundNumber}: Previous round not completed`,
      });
    }
  }

  // Fetch all teams
  const teams = await Team.find();
  if (teams.length < 2)
    return res.status(400).send({ message: "At least 2 teams required" });

  // Swiss Pairing
  const sortedTeams = [...teams].sort((a, b) => b.points - a.points);
  const pairs = [];
  for (let i = 0; i < sortedTeams.length; i += 2) {
    if (sortedTeams[i + 1]) {
      pairs.push({ team1: sortedTeams[i]._id, team2: sortedTeams[i + 1]._id });
    }
  }

  // Save round
  const round = new Round({ roundNumber, matches: pairs });
  await round.save();
  res.send(round);
});

// Update a match score
app.post("/rounds/:roundId/match/:matchIndex", async (req, res) => {
  console.log("in");
  const { score1, score2 } = req.body;
  const round = await Round.findById(req.params.roundId);
  if (!round) return res.status(404).send({ message: "Round not found" });

  const match = round.matches[req.params.matchIndex];
  if (!match) return res.status(404).send({ message: "Match not found" });

  match.score1 = score1;
  match.score2 = score2;
  match.winner = score1 > score2 ? match.team1 : match.team2;

  // Update winner points
  const winnerTeam = await Team.findById(match.winner);
  winnerTeam.points = 1; // 3 points per win
  await winnerTeam.save();

  await round.save();
  res.send(round);
});

// Get all rounds with populated team info
app.get("/rounds", async (req, res) => {
  const rounds = await Round.find().populate(
    "matches.team1 matches.team2 matches.winner"
  );
  res.send(rounds);
});

// Update a round (for match changes)
app.put("/rounds/:roundId/match/:matchIndex", async (req, res) => {
  const { score1, score2 } = req.body;
  const round = await Round.findById(req.params.roundId);
  if (!round) return res.status(404).send({ message: "Round not found" });

  const match = round.matches[req.params.matchIndex];
  if (!match) return res.status(404).send({ message: "Match not found" });

  match.score1 = score1;
  match.score2 = score2;
  match.winner = score1 > score2 ? match.team1 : match.team2;

  await round.save();
  res.send(round);
});

// Delete a round
app.delete("/rounds/:roundId", async (req, res) => {
  await Round.findByIdAndDelete(req.params.roundId);
  res.send({ message: "Deleted" });
});

app.delete("/rounds", async (req, res) => {
  try {
    await Round.deleteMany({}); // deletes all rounds
    res.send({ message: "All rounds deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error deleting rounds" });
  }
});


// ----------------- LEADERBOARD -----------------
app.get("/leaderboard", async (req, res) => {
  console.log("Fetching leaderboard...");
  try {
    // Fetch all rounds with matches and team details
    const rounds = await Round.find().populate(
      "matches.team1 matches.team2 matches.winner"
    );

    if (!rounds || rounds.length === 0) {
      return res.status(404).json({ message: "No rounds found." });
    }

    // Calculate wins per team
    const scores = {}; // <-- removed ": any"
    for (const r of rounds) {
      r.matches.forEach((m) => {
        if (m.team1) scores[m.team1.name] = scores[m.team1.name] || 0;
        if (m.team2) scores[m.team2.name] = scores[m.team2.name] || 0;

        if (m.winner && m.winner.name) {
          scores[m.winner.name] = (scores[m.winner.name] || 0) + 1;
        }
      });
    }

    // Format leaderboard
    const leaderboard = Object.entries(scores)
      .map(([name, wins], index) => ({
        rank: index + 1,
        name,
        wins,
      }))
      .sort((a, b) => b.wins - a.wins);

    return res.json({ leaderboard });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});



// ----------------- TOURNAMENT WINNER -----------------
// GET /winner - compute wins across all rounds and return ranked leaderboard + top winner
app.get("/winner", async (req, res) => {
  try {
    // 1️⃣ Load all rounds and populate team references
    const rounds = await Round.find()
      .populate("matches.team1")
      .populate("matches.team2")
      .populate("matches.winner")
      .exec();

    const totalRounds = rounds.length;

    // 2️⃣ Count wins per team
    const winsById = {}; // { teamIdString: winsCount }
    for (const r of rounds) {
      if (!r.matches) continue;

      for (const m of r.matches) {
        if (!m.winner) continue;

        // Get winner ID robustly
        const winnerId =
          typeof m.winner === "string"
            ? m.winner
            : m.winner._id
            ? String(m.winner._id)
            : String(m.winner);

        winsById[winnerId] = (winsById[winnerId] || 0) + 1;
      }
    }

    // 3️⃣ Collect all teams from rounds (even if they have 0 wins)
    const teamIdSet = new Set();
    for (const r of rounds) {
      for (const m of r.matches || []) {
        if (m.team1) teamIdSet.add(String(m.team1._id ?? m.team1));
        if (m.team2) teamIdSet.add(String(m.team2._id ?? m.team2));
      }
    }

    const teamIds = Array.from(teamIdSet);

    // 4️⃣ Fetch team details
    const teams = await Team.find({ _id: { $in: teamIds } }).exec();

    // Map id → team info
    const idToTeam = {};
    teams.forEach((t) => {
      idToTeam[String(t._id)] = t;
      if (!winsById[String(t._id)]) winsById[String(t._id)] = 0;
    });

    // 5️⃣ Build leaderboard with name and wins
    const leaderboard = Object.entries(winsById)
      .map(([id, wins]) => {
        const team = idToTeam[id];
        return {
          _id: id,
          name: team ? team.name : "Unknown Team",
          wins: wins || 0,
        };
      })
      .sort((a, b) => b.wins - a.wins || a.name.localeCompare(b.name))
      .map((item, idx) => ({ rank: idx + 1, ...item }));

    // 6️⃣ Identify the top winner
    const winner =
      leaderboard.length > 0
        ? leaderboard[0]
        : { _id: null, name: "No teams", wins: 0 };

    // 7️⃣ Return enhanced JSON
    return res.json({
      totalRounds,
      winner,
      winnerName: winner.name, // ✅ Explicit winner name field
      leaderboard,
    });
  } catch (err) {
    console.error("Error calculating winner:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});




// ----------------- SERVER -----------------
const PORT = 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
