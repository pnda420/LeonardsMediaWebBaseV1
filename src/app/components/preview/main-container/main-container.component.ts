import { Component, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PreviewService } from '../../../state/preview.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-main-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main-container.component.html',
  styleUrl: './main-container.component.scss'
})
export class MainContainerComponent {

  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);
  private previews = inject(PreviewService);

  public htmlSafe: SafeHtml | null = null;

  constructor() {
    // Reagiere auf State-Änderungen: immer den letzten Preview anzeigen
    effect(() => {
      const list = this.previews.previews();     // Signal lesen
      const latest = list.length ? list[list.length - 1] : null;

      if (!latest) {
        this.htmlSafe = null;
        return;
      }

      // CSS einmalig / überschreibbar injizieren
      this.appendStyleOnce('mockup-styles', latest.css ?? '');

      // HTML sicher setzen (kommt aus eigenem Backend)
      this.htmlSafe = this.sanitizer.bypassSecurityTrustHtml(latest.html ?? '');
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }

  private appendStyleOnce(id: string, css: string): void {
    if (!css?.trim()) return;
    let el = document.getElementById(id) as HTMLStyleElement | null;
    if (!el) {
      el = document.createElement('style');
      el.id = id;
      el.type = 'text/css';
      document.head.appendChild(el);
    }
    el.textContent = css; // immer mit dem neuesten Preview überschreiben
  }
}
