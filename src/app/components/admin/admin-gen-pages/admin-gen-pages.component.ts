import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../api/api.service';
import { AdminHeaderComponent } from "../admin-header/admin-header.component";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

interface GeneratedPage {
  id: string;
  userId: string;
  name: string;
  pageContent: string;
  description?: string;
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
  imports: [CommonModule, FormsModule, AdminHeaderComponent],
  templateUrl: './admin-gen-pages.component.html',
  styleUrl: './admin-gen-pages.component.scss'
})
export class AdminGenPagesComponent implements OnInit {
  @ViewChild('previewIframe') previewIframe?: ElementRef<HTMLIFrameElement>;

  pages: GeneratedPage[] = [];
  loading = true;
  error = '';
  searchTerm = '';
  selectedPage: GeneratedPage | null = null;
  showPreviewModal = false;
  previewUrl: SafeResourceUrl | null = null;
  private currentBlobUrl: string | null = null;

  constructor(
    private api: ApiService,
    private sanitizer: DomSanitizer
  ) { }

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
    if (!this.searchTerm) return this.pages;

    const term = this.searchTerm.toLowerCase();
    return this.pages.filter(page => {
      return page.name.toLowerCase().includes(term) ||
        page.description?.toLowerCase().includes(term) ||
        page.user?.name.toLowerCase().includes(term) ||
        page.user?.email.toLowerCase().includes(term);
    });
  }

  get stats() {
    const uniqueUserIds = new Set(this.pages.map(p => p.userId));
    const totalSizeBytes = this.pages.reduce((sum, p) => sum + p.pageContent.length, 0);

    return {
      total: this.pages.length,
      uniqueUsers: uniqueUserIds.size,
      totalSize: (totalSizeBytes / 1024 / 1024).toFixed(2)
    };
  }

  openPreview(page: GeneratedPage) {
    this.selectedPage = page;
    this.showPreviewModal = true;
    document.body.style.overflow = 'hidden';

    // Cleanup alte Blob URL
    if (this.currentBlobUrl) {
      URL.revokeObjectURL(this.currentBlobUrl);
    }

    // Erstelle vollständiges HTML-Dokument
    const fullHtml = this.createFullHtmlDocument(page.pageContent);

    // Erstelle Blob und URL
    const blob = new Blob([fullHtml], { type: 'text/html' });
    this.currentBlobUrl = URL.createObjectURL(blob);
    this.previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.currentBlobUrl);
  }

  closePreview() {
    this.selectedPage = null;
    this.showPreviewModal = false;
    this.previewUrl = null;
    document.body.style.overflow = '';

    // Cleanup Blob URL
    if (this.currentBlobUrl) {
      URL.revokeObjectURL(this.currentBlobUrl);
      this.currentBlobUrl = null;
    }
  }

  private createFullHtmlDocument(content: string): string {
    // Extrahiere Styles und Body
    const styles = this.extractStyles(content);
    const body = this.extractBody(content);

    return `
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="color-scheme" content="light">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        html, body {
            width: 100%;
            min-height: 100%;
            overflow-x: hidden;
        }
    </style>
    ${styles}
</head>
<body>
    ${body}
    <script>
        // Blockiere alle Interaktionen
        document.addEventListener('click', function(e) {
            const target = e.target.closest('a, button, [role="button"]');
            if (target) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        }, true);
        
        document.addEventListener('submit', function(e) {
            e.preventDefault();
            return false;
        }, true);
        
        // Verhindere Navigation
        window.addEventListener('beforeunload', function(e) {
            e.preventDefault();
            return false;
        });
    </script>
</body>
</html>
    `.trim();
  }

  private extractStyles(html: string): string {
    const styleMatches = html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi);
    return Array.from(styleMatches).map(match => `<style>${match[1]}</style>`).join('\n');
  }

  private extractBody(html: string): string {
    // Entferne <style> Tags
    let body = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

    // Falls <body> Tags vorhanden sind, nur den Inhalt nehmen
    const bodyMatch = body.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    if (bodyMatch) {
      return bodyMatch[1];
    }

    return body;
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
    const fullHtml = this.createFullHtmlDocument(page.pageContent);
    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${page.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html`;
    a.click();
    window.URL.revokeObjectURL(url);
    console.log('⬇️ Page heruntergeladen');
  }

  copyContent(page: GeneratedPage) {
    const fullHtml = this.createFullHtmlDocument(page.pageContent);
    navigator.clipboard.writeText(fullHtml).then(() => {
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

  clearFilters() {
    this.searchTerm = '';
  }

  ngOnDestroy() {
    // Cleanup beim Zerstören der Komponente
    if (this.currentBlobUrl) {
      URL.revokeObjectURL(this.currentBlobUrl);
    }
  }
}