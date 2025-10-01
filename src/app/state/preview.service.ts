import { Injectable, computed, signal } from '@angular/core';

export interface Preview {
  id: number;
  html: string;
  css: string;
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

  add(input: { html: string; css: string; form?: any }): number {
    const id = Date.now();
    const item: Preview = {
      id,
      html: input.html,
      css: input.css,
      form: input.form ?? null,
      createdAt: Date.now()
    };
    this._previews.update(arr => [...arr, item]);

    // falls noch nichts ausgewählt, erstes Element wählen
    if (this._selectedIndex() === -1) this._selectedIndex.set(0);

    return id;
  }

  selectByIndex(index: number) {
    const len = this._previews().length;
    if (index >= 0 && index < len) this._selectedIndex.set(index);
  }

  clear() {
    this._previews.set([]);
    this._selectedIndex.set(-1);
  }
}
