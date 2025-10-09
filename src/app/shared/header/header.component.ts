// ==================== header.component.ts (UPDATED) ====================
import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { PreviewService } from '../../state/preview.service';
import { AuthService, User, UserRole } from '../../services/auth.service';
import { ToastService } from '../toasts/toast.service';
import { IconComponent } from "../icon/icon.component";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule, IconComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  open = false;
  user: User | null = null;
  UserRole = UserRole; // Für Template

  constructor(
    @Inject(DOCUMENT) private doc: Document,
    public router: Router,
    private previewService: PreviewService,
    private authService: AuthService,
    private toasts: ToastService
  ) { }

  ngOnInit(): void {
    // Subscribe zu User-Änderungen (wichtig!)
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
    });
  }

  ngAfterViewInit(): void {
    this.previewService.loadPreviewsFromLocalStorage();
  }

  toggle() {
    this.open = !this.open;
    this.doc.body.style.overflow = this.open ? 'hidden' : '';
    this.doc.body.style.touchAction = this.open ? 'none' : '';
  }

  routeTo(route: string) {
    this.router.navigate([route]);
    this.open = false;
    this.doc.body.style.overflow = '';
    this.doc.body.style.touchAction = '';
  }

  getPreviewAmmount(): number {
    return this.previewService.previews().length;
  }

  logout() {
    this.authService.logout();
    this.toasts.success('Erfolgreich abgemeldet.', );
    this.router.navigate(['/']);

    this.open = false; // Menu schließen
    this.doc.body.style.overflow = '';
    this.doc.body.style.touchAction = '';
  }

  getRoleBadgeClass(): string {
    return this.user?.role === UserRole.ADMIN ? 'badge--admin' : 'badge--user';
  }

  getRoleLabel(): string {
    return this.user?.role === UserRole.ADMIN ? 'Admin' : 'User';
  }

  isAdmin(): boolean {
    return this.user?.role === UserRole.ADMIN;
  }
}