import { Component } from '@angular/core';
import { PageTitleComponent } from '../../../shared/page-title/page-title.component';
import { AdminHeaderComponent } from '../admin-header/admin-header.component';

@Component({
  selector: 'app-admin-gen-pages',
  standalone: true,
  imports: [PageTitleComponent, AdminHeaderComponent],
  templateUrl: './admin-gen-pages.component.html',
  styleUrl: './admin-gen-pages.component.scss'
})
export class AdminGenPagesComponent {

}
