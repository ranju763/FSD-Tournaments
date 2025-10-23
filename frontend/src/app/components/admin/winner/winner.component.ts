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
  winner: any = null;
  leaderboard: any[] = [];
  totalRounds: number = 0;
  loading = true;
  errorMessage = '';
  private apiUrl = 'http://localhost:5001/winner';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.fetchWinner();
  }

  fetchWinner() {
    this.http.get<any>(this.apiUrl).subscribe({
      next: (res) => {
        // ✅ Parse JSON correctly
        this.totalRounds = res.totalRounds || 0;
        this.winner = res.winner || null;
        this.leaderboard = Array.isArray(res.leaderboard) ? res.leaderboard : [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching winner:', err);
        this.errorMessage = 'Failed to load winner data.';
        this.loading = false;
      }
    });
  }

  goBack() {
    this.router.navigate(['/leaderboard']);
  }
}
