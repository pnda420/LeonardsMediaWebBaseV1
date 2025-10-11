import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PageTitleComponent } from '../../shared/page-title/page-title.component';
import { ToastService } from '../../shared/toasts/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, PageTitleComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  error = '';
  showPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toasts: ToastService
  ) {}

  login() {
    if (!this.email || !this.password) {
      this.error = 'Bitte fülle alle Felder aus';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.router.navigate([returnUrl]);
        this.toasts.success('Erfolgreich eingeloggt.');
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Login fehlgeschlagen. Überprüfe deine Zugangsdaten.';
        this.loading = false;
      }
    });
  }
}