// ==================== pages/profile/profile.component.ts ====================
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, User, UserRole } from '../../services/auth.service';
import { PageTitleComponent } from '../../shared/page-title/page-title.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, PageTitleComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  UserRole = UserRole; // Für Template

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
  }

  logout() {
    this.authService.logout();
  }

  routeTo(route: string) {
    this.router.navigate([route]);
  }

  getRoleBadgeClass(): string {
    return this.user?.role === UserRole.ADMIN ? 'badge--admin' : 'badge--user';
  }

  getRoleLabel(): string {
    return this.user?.role === UserRole.ADMIN ? 'Administrator' : 'Benutzer';
  }
}

// ==================== pages/profile/profile.component.html ====================