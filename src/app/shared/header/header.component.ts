import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { PreviewService } from '../../state/preview.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  open = false;
  constructor(@Inject(DOCUMENT) private doc: Document, public router: Router, private previewService: PreviewService) { }

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

  getPreviewAmmount(): number {
    return this.previewService.previews().length;
  }

    ngAfterViewInit(): void {
      this.previewService.loadPreviewsFromLocalStorage();
  }


}