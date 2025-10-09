import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-header.component.html',
  styleUrl: './admin-header.component.scss'
})
export class AdminHeaderComponent {

constructor(private router: Router) { }

  routes = [
    { path: 'admin/requests', label: 'Kontaktanfragen' },
    { path: 'admin/users', label: 'User Verwaltung' },
    { path: 'admin/gen-pages', label: 'Generierte Seiten' },
    { path: 'admin/settings', label: 'Einstellungen' }
  ];

  routeTo(path: string) {
    this.router.navigate([path]);
  }

}
