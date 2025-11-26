import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-winner',
  standalone: false,
  templateUrl: './winner.component.html',
  styleUrls: ['./winner.component.css']
})
export class WinnerComponent implements OnInit {
  totalRounds: number = 0;
  winner: any = null;
  leaderboard: any[] = [];
  loading = false;
  error = '';

  private apiUrl = 'http://localhost:5001/winner';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.fetchWinner();
  }

  // 🔹 Fetch winner and leaderboard data
  fetchWinner() {
    this.loading = true;
    this.error = '';

    this.http.get(this.apiUrl).subscribe({
      next: (res: any) => {
        this.totalRounds = res.totalRounds || 0;
        this.winner = res.winner || null;
        this.leaderboard = res.leaderboard || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching winner:', err);
        this.error = 'Failed to load winner data.';
        this.loading = false;
      }
    });
  }

  // 🔹 Navigate back to leaderboard
  goBack() {
    this.router.navigate(['/leaderboard']);
  }
}
