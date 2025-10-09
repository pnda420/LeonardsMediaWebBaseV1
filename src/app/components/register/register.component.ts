import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PageTitleComponent } from '../../shared/page-title/page-title.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, PageTitleComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  loading = false;
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  register() {
    if (!this.name || !this.email || !this.password) {
      this.error = 'Bitte fülle alle Felder aus';
      return;
    }

    if (this.password.length < 8) {
      this.error = 'Passwort muss mindestens 8 Zeichen lang sein';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.register(this.email, this.name, this.password).subscribe({
      next: (response) => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.error = err.error?.message || 'Registrierung fehlgeschlagen. Email bereits vergeben?';
        this.loading = false;
      }
    });
  }
}