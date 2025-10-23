import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeamEntryComponent } from './components/admin/team-entry/team-entry.component';
import { RoundViewComponent } from './components/admin/round-view/round-view.component';
import { LeaderboardComponent } from './components/admin/leaderboard/leaderboard.component';
import { WinnerComponent } from './components/admin/winner/winner.component';

const routes: Routes = [
  { path: 'teams', component: TeamEntryComponent },
  { path: 'rounds', component: RoundViewComponent },
  { path: 'leaderboard', component: LeaderboardComponent },
  { path: 'winner', component: WinnerComponent },
  { path: '', redirectTo: '/teams', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


