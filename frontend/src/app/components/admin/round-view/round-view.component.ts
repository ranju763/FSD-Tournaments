import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Round, Match } from '../../../models/round.model';

@Component({
  selector: 'app-round-view',
  standalone: false,
  templateUrl: './round-view.component.html',
  styleUrls: ['./round-view.component.css']
})
export class RoundViewComponent {
  rounds: Round[] = [];
  selectedRoundId: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getRounds();
  }

  getRounds() {
    this.http.get('http://localhost:5001/rounds')
      .subscribe((res: any) => {
        this.rounds = res.map((r: any) => ({ ...r, showLeaderboard: false }));
        if (!this.selectedRoundId && this.rounds.length > 0) {
          this.selectedRoundId = this.rounds[this.rounds.length - 1]._id;
        }
      });
  }

  updateScore(match: any, matchIndex: number, roundId: string) { // 🛑 Stops full page reload

  console.log("in");

  const score1 = Number(match.score1);
  const score2 = Number(match.score2);

  const maxScore = Math.max(score1, score2);
  const diff = Math.abs(score1 - score2);

  let isValidScore = true;

    if (maxScore < 11) {
      isValidScore = false;
      console.error("Invalid: At least one team must reach 11 points.");
    }
    else {
      if (diff !== 2) {
        isValidScore = false;
        console.error("Invalid: Winner must win by at least 2 points.");
      }
    }


    if (isValidScore) {
      this.http.post(`http://localhost:5001/rounds/${roundId}/match/${matchIndex}`, {
        score1: match.score1,
        score2: match.score2
      }).subscribe(
        (res: any) => {
          alert('Match updated successfully!');
        },
        (err) => {
          console.error(err);
          alert('Error updating match');
        }
      );
    }
      if (!isValidScore){
    // Notify the user and stop the HTTP request
    alert('Error: Invalid score combination. The winning score must be 11 or more, with a 2-point difference, or the game is in Deuce.');
    return;
  }
  
}


  createNextRound() {
    const lastRound = this.rounds[this.rounds.length - 1];
    // Check if all matches have a winner (score entered)
    const incomplete = lastRound.matches.some(m => m.team2 && (m.score1 === null || m.score2 === null));
    if (incomplete) {
      alert('Please enter all scores before generating next round.');
      return;
    }

    const nextRoundNumber = lastRound.roundNumber + 1;
    this.http.post(`http://localhost:5001/rounds/start/${nextRoundNumber}`, {})
      .subscribe(() => {
        alert('Next round created!');
        this.getRounds();
      });
  }

  selectRound(roundId: string) {
    this.selectedRoundId = roundId;
  }

  toggleLeaderboard(round: Round) {
    round.showLeaderboard = !round.showLeaderboard;
  }

  getSelectedRound(): Round | undefined {
    return this.rounds.find(r => r._id === this.selectedRoundId);
  }

getLeaderboard(selectedRound: Round) {
  const scores: any = {};

  // Loop through all rounds up to the selected one
  for (const r of this.rounds) {
    if (r.roundNumber > selectedRound.roundNumber) break;

    r.matches.forEach(m => {
      // Initialize both teams
      if (m.team1) scores[m.team1.name] = scores[m.team1.name] || 0;
      if (m.team2) scores[m.team2.name] = scores[m.team2.name] || 0;

      // Increment winner’s score (count of wins)
      if (m.winner && m.winner.name) {
        scores[m.winner.name] = (scores[m.winner.name] || 0) + 1;
      }
    });
  }

  // Return same format: [ [teamName, totalWins], ... ]
  return Object.entries(scores).sort((a: any, b: any) => b[1] - a[1]);
}


}
