import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: false,
  template: `
    <app-navbar></app-navbar>
    <div class="container mt-4">
      <router-outlet></router-outlet>
    </div>
  `
})
export class AppComponent {}
