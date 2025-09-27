import { Component, OnInit } from '@angular/core';
import { PageTitleComponent } from '../../shared/page-title/page-title.component';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ServiceDataService, ServiceItem } from '../../shared/service-data.service';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [PageTitleComponent, RouterLink, CommonModule],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss'
})
export class ServicesComponent implements OnInit {
  services: ServiceItem[] = [];

  constructor(private serviceDataService: ServiceDataService) {}

  ngOnInit(): void {
    this.services = this.serviceDataService.getServices();
  }
}
