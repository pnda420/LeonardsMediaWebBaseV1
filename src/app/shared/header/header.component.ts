import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  open = false;
  constructor(@Inject(DOCUMENT) private doc: Document, public router: Router  ) {}

  toggle() {
    this.open = !this.open;
    this.doc.body.style.overflow = this.open ? 'hidden' : '';
    this.doc.body.style.touchAction = this.open ? 'none' : '';
  }

  routeTo(route: string) {
    this.router.navigate([route]);
    this.open = false;
    this.doc.body.style.overflow = '';
    this.doc.body.style.touchAction = '';
  }

}