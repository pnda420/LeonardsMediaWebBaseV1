import { Injectable, computed, signal } from '@angular/core';
import { ApiService, GeneratedPage } from '../api/api.service';

export interface Preview {
  id: string; // Jetzt DB-ID statt timestamp
  html: string;
  form: any;
  createdAt: Date;
  pageId?: string; // Optional: DB Page ID
}

@Injectable({ providedIn: 'root' })
export class PreviewService {
  private _previews = signal<Preview[]>([]);
  private _selectedIndex = signal<number>(-1);
  private _currentUserId = signal<string | null>(null);

  readonly previews = this._previews.asReadonly();
  readonly selectedIndex = this._selectedIndex.asReadonly();
  readonly selected = computed(() => {
    const idx = this._selectedIndex();
    const list = this._previews();
    return idx >= 0 && idx < list.length ? list[idx] : null;
  });

  constructor(private apiService: ApiService) { }

  // Temporäre Preview hinzufügen (für sofortige Anzeige nach Generierung)
  addTemporary(input: { html: string; form?: any; pageId?: string }): void {
    const item: Preview = {
      id: input.pageId || Date.now().toString(),
      html: input.html,
      form: input.form ?? null,
      createdAt: new Date(),
      pageId: input.pageId
    };
    this._previews.update(arr => [...arr, item]);

    // Neu hinzugefügte Preview automatisch auswählen
    this._selectedIndex.set(this._previews().length - 1);
  }

  // Pages eines Users aus DB laden
  async loadUserPages(userId: string): Promise<void> {
    this._currentUserId.set(userId);

    try {
      const pages = await this.apiService.getUserPages(userId).toPromise();

      if (pages && pages.length > 0) {
        const previews: Preview[] = pages.map(page => ({
          id: page.id,
          html: page.pageContent,
          form: null, // Form-Daten sind optional
          createdAt: new Date(page.createdAt),
          pageId: page.id
        }));

        this._previews.set(previews);

        // Letzte Page auswählen
        if (this._selectedIndex() === -1) {
          this._selectedIndex.set(previews.length - 1);
        }
      } else {
        this._previews.set([]);
        this._selectedIndex.set(-1);
      }
    } catch (error) {
      console.error('Fehler beim Laden der Pages:', error);
      this._previews.set([]);
      this._selectedIndex.set(-1);
    }
  }

  selectByIndex(index: number): void {
    const len = this._previews().length;
    if (index >= 0 && index < len) {
      this._selectedIndex.set(index);
    }
  }

  // Page aus DB löschen
  async deletePage(pageId: string, userId: string): Promise<boolean> {
    try {
      await this.apiService.deleteGeneratedPage(pageId, userId).toPromise();

      // Aus lokaler Liste entfernen
      this._previews.update(arr => arr.filter(p => p.pageId !== pageId));

      // Index anpassen
      const newLength = this._previews().length;
      if (this._selectedIndex() >= newLength) {
        this._selectedIndex.set(Math.max(0, newLength - 1));
      }

      return true;
    } catch (error) {
      console.error('Fehler beim Löschen:', error);
      return false;
    }
  }

  clear(): void {
    this._previews.set([]);
    this._selectedIndex.set(-1);
    this._currentUserId.set(null);
  }

  getCurrentUserId(): string | null {
    return this._currentUserId();
  }
}