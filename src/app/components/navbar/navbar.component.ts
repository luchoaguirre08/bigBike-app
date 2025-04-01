// src/app/components/navbar/navbar.component.ts
import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  isMenuOpen = false;

  user = this.auth.getUser;
  isLoggedIn = this.auth.isLoggedIn;
  authService = inject(AuthService);

  constructor(private auth: AuthService) {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  logout() {
    this.auth.logout();
  }
  get isAuthenticated() {
    return this.authService.isLoggedIn();
  }

  logoutSesion() {
    this.authService.logout();
  }

  getUserEmail(): string {
    return this.authService.getUser()?.email || '';
  }
}
