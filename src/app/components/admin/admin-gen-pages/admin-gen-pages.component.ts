// ==================== pages/admin-gen-pages/admin-gen-pages.component.ts ====================
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../api/api.service';
import { PageTitleComponent } from '../../../shared/page-title/page-title.component';
import { AdminHeaderComponent } from "../admin-header/admin-header.component";


interface GeneratedPage {
  id: string;
  userId: string;
  name: string;
  pageContent: string;
  description?: string;
  isPublished: boolean;
  previewUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    name: string;
    email: string;
  };
}

@Component({
  selector: 'app-admin-gen-pages',
  standalone: true,
  imports: [CommonModule, FormsModule, PageTitleComponent, AdminHeaderComponent],
  templateUrl: './admin-gen-pages.component.html',
  styleUrl: './admin-gen-pages.component.scss'
})
export class AdminGenPagesComponent implements OnInit {
  pages: GeneratedPage[] = [];
  loading = true;
  error = '';
  searchTerm = '';
  filterStatus: 'all' | 'published' | 'draft' = 'all';
  selectedPage: GeneratedPage | null = null;
  showPreviewModal = false;

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.loadPages();
  }

  loadPages() {
    this.loading = true;
    this.error = '';

    this.api.getAllGeneratedPages().subscribe({
      next: (pages) => {
        this.pages = pages;
        this.loading = false;
      },
      error: (err) => {
        console.error('Fehler beim Laden:', err);
        this.error = 'Fehler beim Laden der Pages';
        this.loading = false;
      }
    });
  }

  get filteredPages(): GeneratedPage[] {
    return this.pages.filter(page => {
      // Search Filter
      const matchesSearch = !this.searchTerm ||
        page.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        page.description?.toLowerCase().includes(this.searchTerm.toLowerCase());

      // Status Filter
      const matchesStatus = this.filterStatus === 'all' ||
        (this.filterStatus === 'published' && page.isPublished) ||
        (this.filterStatus === 'draft' && !page.isPublished);

      return matchesSearch && matchesStatus;
    });
  }

  get stats() {
    return {
      total: this.pages.length,
      published: this.pages.filter(p => p.isPublished).length,
      draft: this.pages.filter(p => !p.isPublished).length
    };
  }

  openPreview(page: GeneratedPage) {
    this.selectedPage = page;
    this.showPreviewModal = true;
    document.body.style.overflow = 'hidden';
  }

  closePreview() {
    this.selectedPage = null;
    this.showPreviewModal = false;
    document.body.style.overflow = '';
  }

  togglePublish(page: GeneratedPage) {
    const newStatus = !page.isPublished;

    this.api.updateGeneratedPage(page.id, { isPublished: newStatus }).subscribe({
      next: (updated) => {
        const index = this.pages.findIndex(p => p.id === page.id);
        if (index !== -1) {
          this.pages[index] = updated;
        }
        console.log(`✅ Page ${newStatus ? 'veröffentlicht' : 'auf Draft gesetzt'}`);
      },
      error: (err) => {
        console.error('Fehler beim Update:', err);
        alert('Fehler beim Aktualisieren');
      }
    });
  }

  deletePage(page: GeneratedPage) {
    if (!confirm(`Page "${page.name}" wirklich löschen?\n\nDiese Aktion kann nicht rückgängig gemacht werden!`)) {
      return;
    }

    this.api.deleteGeneratedPage(page.id).subscribe({
      next: () => {
        this.pages = this.pages.filter(p => p.id !== page.id);
        console.log('✅ Page gelöscht');
        if (this.selectedPage?.id === page.id) {
          this.closePreview();
        }
      },
      error: (err) => {
        console.error('Fehler beim Löschen:', err);
        alert('Fehler beim Löschen der Page');
      }
    });
  }

  downloadPage(page: GeneratedPage) {
    const blob = new Blob([page.pageContent], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${page.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  copyContent(page: GeneratedPage) {
    navigator.clipboard.writeText(page.pageContent).then(() => {
      console.log('📋 Content kopiert');
      alert('✅ Content in Zwischenablage kopiert!');
    });
  }

  formatDate(dateString: Date): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffDays === 0) {
      return 'Heute';
    } else if (diffDays === 1) {
      return 'Gestern';
    } else if (diffDays < 7) {
      return `vor ${diffDays} Tagen`;
    } else {
      return date.toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
  }

  getContentPreview(content: string, maxLength: number = 100): string {
    const text = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

  clearFilters() {
    this.searchTerm = '';
    this.filterStatus = 'all';
  }
}