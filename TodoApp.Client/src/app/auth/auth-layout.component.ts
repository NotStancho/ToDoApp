import {Component} from '@angular/core';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  template: `
    <div class="relative min-h-screen overflow-hidden px-6 pt-12 pb-16">
      <div class="auth-orb orb-1"></div>
      <div class="auth-orb orb-2"></div>

      <div class="relative z-10 mx-auto grid max-w-275 grid-cols-1 gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <ng-content select="[hero]"></ng-content>
        <ng-content select="[card]"></ng-content>
      </div>
    </div>
  `
})
export class AuthLayoutComponent {}
