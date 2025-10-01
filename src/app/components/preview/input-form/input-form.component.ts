import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, FormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { PreviewService } from '../../../state/preview.service';


interface MockupResponse {
  ok: boolean;
  html: string;   // HTML ohne <style>
  css: string;    // extrahiertes CSS
  rawLength: number;
}

@Component({
  selector: 'app-input-form',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './input-form.component.html',
  styleUrl: './input-form.component.scss'
})
export class InputFormComponent {

  form!: FormGroup;
  loading = false;

  // Dev-URL anpassen:
  private readonly API_URL = 'http://localhost:6464/audio/mockup';
  private readonly API_KEY = 'jg83kf784jf94jdf984';

  private http = inject(HttpClient);
  private previews = inject(PreviewService);

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      companyName: new FormControl('', [Validators.required]),
      useCompanyImage: new FormControl(false),
      companyImage: new FormControl(''),
      primaryColor: new FormControl('', [Validators.required]),
      secondaryColor: new FormControl('', [Validators.required]),
      typeOfWebsite: new FormControl('', [Validators.required]),
      contentInformation: new FormControl('', [Validators.required]),
    });
  }

  async onSubmit(): Promise<void> {
    if (!this.form.valid || this.loading) return;

    this.loading = true;
    const headers = new HttpHeaders({
      'x-api-key': this.API_KEY,
      'Content-Type': 'application/json'
    });

    try {
      const body = { form: this.form.value };
      const res = await firstValueFrom(
        this.http.post<MockupResponse>(this.API_URL, body, { headers })
      );

      console.log('[mockup] response:', res);

      // In den State pushen (immer):
      this.previews.add({
        html: res?.html ?? '',
        css: res?.css ?? '',
        form: this.form.value
      });

      console.log('[state] previews count:', this.previews.previews().length);

    } catch (err) {
      const e = err as HttpErrorResponse;
      console.error('[mockup] call failed:', e.status, e.message, e.error);
    } finally {
      this.loading = false;
    }
  }

  // Optional: Prompt-Debug
  buildPrompt(): string {
    const prompt = `${JSON.stringify(this.form.value)}`;
    console.log('[prompt]', prompt);
    return prompt;
  }
}
