import { Component, OnInit } from '@angular/core';
import { PageTitleComponent } from "../../shared/page-title/page-title.component";
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServiceDataService, ServiceItem } from '../../shared/service-data.service';
import { ApiService, ServiceType, CreateContactRequestDto } from '../../api/api.service';
import { finalize } from 'rxjs';
import { ToastService } from '../../shared/toasts/toast.service';


type State = 'idle' | 'loading' | 'success' | 'error';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [PageTitleComponent, CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent implements OnInit {
  constructor(
    public router: Router,
    private serviceData: ServiceDataService,
    private api: ApiService,
    private toasts: ToastService
  ) { }

  state: State = 'idle';
  busy = false;
  services: ServiceItem[] = [];
  model = {
    name: '',
    email: '',
    message: '',
    callback: false,
    phone: '',
    service: ''
  };

  ngOnInit(): void {
    this.services = this.serviceData.getServices();
  }

  submit() {
    // Validierung

    if (this.busy || this.state === 'loading' || !this.model.name || !this.model.email) {
      return;
    }

    this.busy = true;

    this.state = 'loading';

    // ServiceType mapping
    const serviceTypeMap: { [key: string]: ServiceType } = {
      'Einfache Website': ServiceType.SIMPLE_WEBSITE,
      'Standard Website': ServiceType.STANDARD_WEBSITE,
      'Individual Website': ServiceType.INDIVIDUAL_WEBSITE,
      'SEO Optimierung': ServiceType.SEO
    };

    // DTO zusammenbauen
    const contactRequest: CreateContactRequestDto = {
      name: this.model.name,
      email: this.model.email,
      message: this.model.message || 'Keine Nachricht angegeben',
      serviceType: this.model.service
        ? serviceTypeMap[this.model.service] || ServiceType.NOT_SURE
        : ServiceType.NOT_SURE,
      prefersCallback: this.model.callback,
      phoneNumber: this.model.callback ? this.model.phone : undefined
    };

    // API Call
    this.api.createContactRequest(contactRequest)
      .pipe(finalize(() => { this.busy = false; }))
      .subscribe({
        next: (response) => {
          console.log('✅ Kontaktanfrage erfolgreich gesendet:', response);
          this.state = 'success';
          this.toasts.success('Kontaktanfrage erfolgreich gesendet!', { duration: 5000 });
        },
        error: (error) => {
          console.error('❌ Fehler beim Senden der Kontaktanfrage:', error);
          this.state = 'error';
          this.toasts.error('Fehler beim Senden der Kontaktanfrage.', {  duration: 5000 });

          // Error-State nach 5 Sekunden zurücksetzen
          setTimeout(() => {
            this.state = 'idle';
          }, 5000);
        }
      });
  }

  newMessage() {
    this.resetForm();
  }

  private resetForm() {
    this.model = {
      name: '',
      email: '',
      message: '',
      callback: false,
      phone: '',
      service: ''
    };
    this.state = 'idle';
  }
} 