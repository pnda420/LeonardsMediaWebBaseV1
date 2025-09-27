import { Component } from '@angular/core';
import { PageTitleComponent } from "../../shared/page-title/page-title.component";
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type State = 'idle' | 'success' | 'error';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [PageTitleComponent, RouterLink, CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  constructor(public router: Router) {}

  state: State = 'idle';
  model = {
    name: '',
    email: '',
    message: '',
    callback: false,
    phone: ''
  };

  submit() {
    // TODO: echten Versand per Service integrieren
    // Pragmatik: wir simulieren Erfolg – setz hier deinen HTTP-Call ein.
    try {
      // await this.contactService.send(this.model).toPromise();
      this.state = 'success';
    } catch {
      this.state = 'error';
    }
  }
}
