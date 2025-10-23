import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Round } from '../../../models/round.model';

@Component({
  selector: 'app-leaderboard',
  standalone: false,
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit, OnChanges {
  @Input() selectedRound!: Round; // Currently selected round (optional)
  leaderboard: any[] = [];
  loading = false;
  error = '';

  private apiUrl = 'http://localhost:5001/leaderboard'; // Backend route

  constructor(private http: HttpClient) {}

  // 🔹 Fetch leaderboard when component initializes
  ngOnInit() {
    this.fetchLeaderboard();
  }

  // 🔹 Fetch leaderboard whenever selectedRound changes
  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedRound'] && !changes['selectedRound'].firstChange) {
      this.fetchLeaderboard();
    }
  }

  // 🔹 Fetch leaderboard data from backend
  fetchLeaderboard() {
    this.loading = true;
    this.error = '';
    console.log('Fetching leaderboard...');
    this.http.get(this.apiUrl).subscribe({
      next: (res: any) => {
        console.log('Server response:', res);
        this.leaderboard = (res.leaderboard || []).sort((a: any, b: any) => b.win - a.win);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching leaderboard:', err);
        this.error = 'Failed to load leaderboard.';
        this.loading = false;
      }
    });
  }

  // 🔹 Download leaderboard as CSV
  downloadCSV() {
    if (!this.leaderboard.length) {
      alert('No data to download!');
      return;
    }

    const header = ['Rank', 'Team Name', 'Wins', 'Losses', 'Draws', 'Points'];
    const rows = this.leaderboard.map((t, i) => [
      i + 1,
      t.name,
      t.wins,
      t.losses,
      t.draws,
      t.points
    ]);

    const csvContent = [header, ...rows].map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'leaderboard.csv';
    link.click();

    window.URL.revokeObjectURL(url);
  }
}
