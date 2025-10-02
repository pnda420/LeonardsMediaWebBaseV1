import { Injectable, computed, signal } from '@angular/core';

export interface Preview {
  id: number;
  html: string;
  form: any;
  createdAt: number;
}

@Injectable({ providedIn: 'root' })
export class PreviewService {
  // interne, schreibbare Signals
  private _previews = signal<Preview[]>([]);
  private _selectedIndex = signal<number>(-1);

  // öffentliche, nur-lesbare Views
  readonly previews = this._previews.asReadonly();
  readonly selectedIndex = this._selectedIndex.asReadonly();
  readonly selected = computed(() => {
    const idx = this._selectedIndex();
    const list = this._previews();
    return idx >= 0 && idx < list.length ? list[idx] : null;
    // null, wenn nichts ausgewählt
  });

  add(input: { html: string; form?: any }): number {
    const id = Date.now();
    const item: Preview = {
      id,
      html: input.html,
      form: input.form ?? null,
      createdAt: Date.now()
    };
    this._previews.update(arr => [...arr, item]);

    // falls noch nichts ausgewählt, erstes Element wählen
    if (this._selectedIndex() === -1) this._selectedIndex.set(0);

    this.addPreviewToLocalStorage();

    return id;
  }

  setCurrentActivePreview(id: number) {
    this._selectedIndex.set(id);
  }

  selectByIndex(index: number) {
    const len = this._previews().length;
    if (index >= 0 && index < len) this._selectedIndex.set(index);
  }

  addPreviewToLocalStorage() {
    const data = this._previews();
    localStorage.setItem('previews', JSON.stringify(data));
  }

  loadPreviewsFromLocalStorage() {
    const raw = localStorage.getItem('previews');
    if (raw) {
      try {
        const data = JSON.parse(raw) as Preview[];
        this._previews.set(data);
        this._selectedIndex.set(data.length ? 0 : -1);
      } catch {
        // ignore
      }
    }
  }

  clear() {
    this._previews.set([]);
    this._selectedIndex.set(-1);
  }
}
