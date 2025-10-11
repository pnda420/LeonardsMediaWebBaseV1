// ==================== pages/admin-users/admin-users.component.ts ====================
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageTitleComponent } from '../../../shared/page-title/page-title.component';
import { ApiService } from '../../../api/api.service';
import { User, UserRole } from '../../../services/auth.service';
import { AdminHeaderComponent } from "../admin-header/admin-header.component";


interface UserStats {
  totalUsers: number;
  newsletterSubscribers: number;
  subscriberRate: number;
}

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminHeaderComponent],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.scss'
})
export class AdminUsersComponent implements OnInit {
  users: User[] = [];
  stats: UserStats | null = null;
  loading = true;
  error = '';
  searchTerm = '';
  filterRole: 'all' | 'admin' | 'user' = 'all';
  filterNewsletter: 'all' | 'subscribed' | 'not-subscribed' = 'all';

  UserRole = UserRole; // Für Template

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.error = '';

    // Lade Users und Stats parallel
    Promise.all([
      this.api.getAllUsers().toPromise(),
      this.api.getUserStats().toPromise()
    ])
      .then(([users, stats]) => {
        this.users = users || [];
        this.stats = stats || null;
        this.loading = false;
      })
      .catch((err) => {
        console.error('Fehler beim Laden:', err);
        this.error = 'Fehler beim Laden der Daten';
        this.loading = false;
      });
  }

  get filteredUsers(): User[] {
    return this.users.filter(user => {
      // Search Filter
      const matchesSearch = !this.searchTerm ||
        user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase());

      // Role Filter
      const matchesRole = this.filterRole === 'all' ||
        user.role === (this.filterRole === 'admin' ? UserRole.ADMIN : this.filterRole === 'user' ? UserRole.USER : user.role);

      // Newsletter Filter (optional - falls User das Property hat)
      const matchesNewsletter = this.filterNewsletter === 'all';
      // || (this.filterNewsletter === 'subscribed' && user.wantsNewsletter) ||
      // (this.filterNewsletter === 'not-subscribed' && !user.wantsNewsletter);

      return matchesSearch && matchesRole && matchesNewsletter;
    });
  }

  deleteUser(user: User) {
    if (!confirm(`User "${user.name}" wirklich löschen?\n\nDiese Aktion kann nicht rückgängig gemacht werden!`)) {
      return;
    }

    this.api.deleteUser(user.id).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.id !== user.id);
        console.log('✅ User gelöscht:', user.email);
      },
      error: (err) => {
        console.error('❌ Fehler beim Löschen:', err);
        alert('Fehler beim Löschen des Users');
      }
    });
  }

  makeAdmin(user: User) {
    if (!confirm(`"${user.name}" zum Admin machen?`)) {
      return;
    }

    // TODO: Implementiere Update-Endpoint im Backend für Role
    console.log('⚠️ Role-Update noch nicht implementiert');
    alert('Role-Update Endpoint muss noch im Backend implementiert werden');

    // Wenn implementiert:
    // this.api.updateUser(user.id, { role: UserRole.ADMIN }).subscribe({
    //   next: (updated) => {
    //     const index = this.users.findIndex(u => u.id === user.id);
    //     if (index !== -1) {
    //       this.users[index] = updated;
    //     }
    //   },
    //   error: (err) => {
    //     console.error('Fehler:', err);
    //   }
    // });
  }

  removeAdmin(user: User) {
    if (!confirm(`Admin-Rechte von "${user.name}" entfernen?`)) {
      return;
    }

    // TODO: Implementiere Update-Endpoint im Backend für Role
    console.log('⚠️ Role-Update noch nicht implementiert');
    alert('Role-Update Endpoint muss noch im Backend implementiert werden');
  }

  copyEmail(email: string) {
    navigator.clipboard.writeText(email).then(() => {
      console.log('📋 Email kopiert:', email);
    });
  }

  formatDate(dateString?: Date): string {
    if (!dateString) return '-';

    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getRoleBadgeClass(role: UserRole): string {
    return role === UserRole.ADMIN ? 'badge--admin' : 'badge--user';
  }

  getRoleLabel(role: UserRole): string {
    return role === UserRole.ADMIN ? 'Administrator' : 'Benutzer';
  }

  clearFilters() {
    this.searchTerm = '';
    this.filterRole = 'all';
    this.filterNewsletter = 'all';
  }
}