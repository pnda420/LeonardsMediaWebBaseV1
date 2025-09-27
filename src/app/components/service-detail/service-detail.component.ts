import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ServiceDataService, ServiceItem } from '../../shared/service-data.service';
import { CommonModule } from '@angular/common';

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
    private serviceDataService: ServiceDataService
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
      } else {
        // Wenn kein Slug vorhanden ist, ebenfalls navigieren
        this.router.navigate(['/services']);
      }
    });
  }
}
