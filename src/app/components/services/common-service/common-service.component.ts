import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ServiceConfig } from './service.interface';
import { SERVICE_CONFIGS } from './service.config';
import { PageTitleComponent } from '../../../shared/page-title/page-title.component';

@Component({
  selector: 'app-common-service',
  standalone: true,
  imports: [CommonModule, PageTitleComponent],
  templateUrl: './common-service.component.html',
  styleUrl: './common-service.component.scss'
})
export class CommonServiceComponent {
  config: ServiceConfig | null = null;

  constructor(
    public router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    // Hole den Slug aus der Route
    const slug = this.route.snapshot.paramMap.get('slug');

    if (slug && SERVICE_CONFIGS[slug]) {
      this.config = SERVICE_CONFIGS[slug];
    } else {
      // Fallback oder 404
      this.router.navigate(['/services']);
    }
  }

  scrollTo(id: string) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
