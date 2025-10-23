import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TeamEntryComponent } from './components/admin/team-entry/team-entry.component';
import { RoundViewComponent } from './components/admin/round-view/round-view.component';
import { WinnerComponent } from './components/admin/winner/winner.component';
import { LeaderboardComponent } from './components/admin/leaderboard/leaderboard.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';

@NgModule({
  declarations: [
    AppComponent,
    TeamEntryComponent,
    RoundViewComponent,
    WinnerComponent,
    LeaderboardComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
