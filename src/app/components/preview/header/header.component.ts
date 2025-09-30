import { CommonModule } from '@angular/common';
import { Component, HostBinding, HostListener, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

export type Theme = 'light' | 'dark';
export type CtaKind = 'primary' | 'ghost';

export interface NavItem {
  label: string;
}

export interface Cta {
  label: string;
  route?: string | any[];
  href?: string;
  kind?: CtaKind;
}

@Component({
  selector: 'app-preview-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  /** Branding */
  @Input() brandImg?: string;
  @Input() brandAlt = 'Logo';
  @Input() brandText?: string;
  @Input() brandRoute: string | any[] = '/';

  /** Navigation + CTA */
  @Input({ required: true }) nav: NavItem[] = [];
  @Input() cta?: Cta;

  /** Verhalten & Stil */
  @Input() theme: Theme = 'light';
  @Input() sticky = true;
  @Input() transparent = false;
  @Input() showBorder = true;

  /** Breakpoint für Mobile/Drawer (px) – wird zur Laufzeit ausgewertet */
  @Input() collapseAt = 900;

  /** Höhen- und Farb-Tokens (kannst du auch per [style.--header-bg] setzen) */
  @Input() headerHeight = 64;
  @Input() headerBg?: string;   // HostBinding auf --header-bg
  @Input() headerFg?: string;   // --header-fg
  @Input() headerBorder?: string; // --header-border

  @HostBinding('class.is-sticky') get isSticky() { return this.sticky; }
  @HostBinding('class.is-transparent') get isTransparent() { return this.transparent; }
  @HostBinding('class.theme-dark') get isDark() { return this.theme === 'dark'; }
  @HostBinding('style.--header-h.px') get hVar() { return this.headerHeight; }
  @HostBinding('style.--header-bg') get bgVar() { return this.headerBg ?? null; }
  @HostBinding('style.--header-fg') get fgVar() { return this.headerFg ?? null; }
  @HostBinding('style.--header-border') get brdVar() { return this.headerBorder ?? null; }

  open = false;
  isDesktop = false;

  ngOnInit() { this.onResize(); }

  @HostListener('window:resize')
  onResize() {
    this.isDesktop = window.innerWidth >= this.collapseAt;
    if (this.isDesktop) this.open = false;
  }

}
