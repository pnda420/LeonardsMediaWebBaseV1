import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ServiceDataService, ServiceItem } from '../../shared/service-data.service';
import { CommonModule } from '@angular/common';
import { SeoService } from '../../shared/seo.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-service-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './service-detail.component.html',
  styleUrl: './service-detail.component.scss'
})
export class ServiceDetailComponent implements OnInit {
  service: ServiceItem | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private serviceDataService: ServiceDataService,
    private seo: SeoService,
    @Inject(DOCUMENT) private doc: Document
  ) {}

  ngOnInit(): void {
    // Wir verwenden switchMap, um auf Änderungen in den Routenparametern zu reagieren,
    // falls der Benutzer innerhalb der Detailansichten navigiert.
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (slug) {
        this.service = this.serviceDataService.getServiceBySlug(slug);
        // Optional: Wenn der Service nicht gefunden wird, zur 404-Seite oder zur Übersicht navigieren
        if (!this.service) {
          this.router.navigate(['/services']);
        }
        if (this.service) {
          this.updateSeo(this.service);
        }
      } else {
        // Wenn kein Slug vorhanden ist, ebenfalls navigieren
        this.router.navigate(['/services']);
      }
    });
  }

  private updateSeo(service: ServiceItem) {
    const title = `Leonards Media | ${service.title}`;
    const description = service.short || service.details?.description || 'Details zu unserer Dienstleistung.';
    const url = this.doc.location.href;

    // Build JSON-LD for Service
    const origin = this.doc.location.origin;
    const image = service.img?.startsWith('http')
      ? service.img
      : `${origin}${service.img.startsWith('/') ? '' : '/'}${service.img}`;

    const jsonLd: any = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: service.title,
      description: description,
      url: url,
      image: image,
      provider: {
        '@type': 'Organization',
        name: 'Leonards Media'
      }
    };

    this.seo.update({ title, description, url, image, structuredData: jsonLd, type: 'product' });
  }
}
