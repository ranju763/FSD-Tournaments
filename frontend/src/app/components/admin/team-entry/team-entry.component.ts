import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-team-entry',
  standalone: false,
  templateUrl: './team-entry.component.html',
  styleUrls: ['./team-entry.component.css']
})
export class TeamEntryComponent {
  apiUrl = 'http://localhost:5001';
  teamName: string = '';
  teamMembersInput: string = '';
  teams: any[] = [];
  editingTeam: any = null;

  constructor(private http: HttpClient,private router: Router) {}

  // ✅ CREATE or UPDATE team
  addOrUpdateTeam() {
    if (!this.teamName.trim()) return alert('Team name cannot be empty!');
    if (!this.teamMembersInput.trim()) return alert('Team members cannot be empty!');

    // Parse team members from comma-separated input
    const players = this.teamMembersInput
      .split(',')
      .map(member => member.trim())
      .filter(member => member.length > 0);

    if (players.length === 0) return alert('Please enter at least one team member!');

    const teamData = { 
      name: this.teamName, 
      players: players 
    };

    if (this.editingTeam) {
      // Update existing team
      this.http.put(`${this.apiUrl}/teams/${this.editingTeam._id}`, teamData)
        .subscribe({
          next: () => {
            alert('Team updated successfully!');
            this.resetForm();
            this.getTeams();
          },
          error: (error) => {
            console.error('Error updating team:', error);
            alert('Error updating team: ' + (error.error?.message || error.message || 'Unknown error'));
          }
        });
    } else {
      // Create new team
      this.http.post(`${this.apiUrl}/teams`, teamData)
        .subscribe({
          next: () => {
            alert('Team added successfully!');
            this.resetForm();
            this.getTeams();
          },
          error: (error) => {
            console.error('Error adding team:', error);
            alert('Error adding team: ' + (error.error?.message || error.message || 'Unknown error'));
          }
        });
    }
  }

  // ✅ READ all teams
  getTeams() {
    this.http.get(`${this.apiUrl}/teams`).subscribe((res: any) => {
      this.teams = res;
    });
  }

  // ✅ DELETE a team
  deleteTeam(id: string) {
    if (confirm('Are you sure you want to delete this team?')) {
      this.http.delete(`${this.apiUrl}/teams/${id}`).subscribe(() => {
        alert('Team deleted successfully!');
        this.getTeams();
      });
    }
  }

  // ✅ EDIT team name
  editTeam(team: any) {
    this.teamName = team.name;
    this.teamMembersInput = team.players ? team.players.join(', ') : '';
    this.editingTeam = team;
  }

  // ✅ RESET form
  resetForm() {
    this.teamName = '';
    this.editingTeam = null;
  }

  // ✅ START TOURNAMENT - clears rounds & creates first round
  startTournament() {
    if (confirm('This will clear all existing rounds and start a new tournament. Continue?')) {
      this.http.post(`${this.apiUrl}/rounds/start/1`, {}).subscribe(() => {
        alert('Tournament started! First round created successfully.');
        this.router.navigate(['/rounds']);
      });
    }
  }

  ngOnInit() {
    this.getTeams();
  }
}
