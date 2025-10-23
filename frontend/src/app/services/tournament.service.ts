import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TournamentService {
  teams: any[] = [];
  matches: any[] = [];
  currentRound = 0;

  addTeam(name: string) {
    this.teams.push({ name, wins: 0, points: 0 });
  }

  generatePairings() {
    this.currentRound++;
    const shuffled = [...this.teams].sort(() => Math.random() - 0.5);
    this.matches = [];

    for (let i = 0; i < shuffled.length; i += 2) {
      if (i + 1 < shuffled.length) {
        this.matches.push({ teamA: shuffled[i].name, teamB: shuffled[i + 1].name, winner: null });
      }
    }
  }

  updateResult(match: any, winner: string) {
    match.winner = winner;
    const team = this.teams.find(t => t.name === winner);
    if (team) {
      team.wins++;
      team.points += 2;
    }
  }

  getLeaderboard() {
    return this.teams.sort((a, b) => {
      if (b.wins === a.wins) return b.points - a.points;
      return b.wins - a.wins;
    });
  }

  getWinner() {
    return this.getLeaderboard()[0];
  }
}
