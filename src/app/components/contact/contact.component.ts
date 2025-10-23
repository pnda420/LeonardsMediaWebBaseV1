import { Component, OnInit } from '@angular/core';
import { PageTitleComponent } from "../../shared/page-title/page-title.component";
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
export class ContactComponent {
  constructor(
    public router: Router,
    private toasts: ToastService
  ) { }

  state: State = 'idle';
  busy = false;

  submit() {


    this.busy = true;

    this.state = 'loading';



    // API Call
  }

  newMessage() {
    this.resetForm();
  }

  private resetForm() {
  }

} 