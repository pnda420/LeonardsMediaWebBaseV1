import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IsActiveMatchOptions, Router, RouterModule } from '@angular/router';

interface AdminRoute {
  path: string;
  label: string;
  icon?: string;
}

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-header.component.html',
  styleUrl: './admin-header.component.scss'
})
export class AdminHeaderComponent {
  @Input() base = '/admin';


  constructor(public router: Router) {

  }

  routeTo(path: string, event?: MouseEvent) {
    event?.preventDefault(); // damit der native Link nicht voll lädt
    const url = this.normalize(path);
    this.router.navigateByUrl(url);
  }

  // Für sichtbaren Active-State
  isActive(path: string): boolean {
    const url = this.normalize(path);
    const opts: IsActiveMatchOptions = {
      paths: 'exact',
      queryParams: 'ignored',
      fragment: 'ignored',
      matrixParams: 'ignored'
    };
    return this.router.isActive(url, opts);
  }

  // Für href im <a>
  getHref(path: string): string {
    return this.normalize(path);
  }

  // ---- Helpers ----
  private normalize(path: string): string {
    // Absolut, wenn bereits mit "/" beginnt
    if (!path) return this.base;
    if (path.startsWith('/')) return path;

    // Wenn "admin/..." übergeben wird, vorn "/" ergänzen
    if (path.startsWith('admin')) return `/${path}`;

    // Sonst als Child unterhalb von base behandeln (z.B. "requests" -> "/admin/requests")
    const base = this.base.endsWith('/') ? this.base.slice(0, -1) : this.base;
    return `${base}/${path}`;
  }

  routes: AdminRoute[] = [
    {
      path: 'admin/requests',
      label: 'Kontaktanfragen',
      icon: 'mail'
    },
    {
      path: 'admin/users',
      label: 'User Verwaltung',
      icon: 'group'
    },
    {
      path: 'admin/gen-pages',
      label: 'Generierte Seiten',
      icon: 'auto_awesome'
    },
    {
      path: 'admin/booking',
      label: 'Buchungen',
      icon: 'calendar_today'
    },

    // {
    //   path: 'admin/settings',
    //   label: 'Einstellungen',
    //   icon: 'settings'
    // }
  ];

}