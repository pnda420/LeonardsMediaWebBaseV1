import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PageTitleComponent } from '../../../shared/page-title/page-title.component';

@Component({
  selector: 'app-standard-website',
  standalone: true,
  imports: [CommonModule, FormsModule, PageTitleComponent],
  templateUrl: './standard-website.component.html',
  styleUrl: './standard-website.component.scss'
})
export class StandardWebsiteComponent {

  constructor(public router: Router) { }

  img = 'assets/cards/2-min.png';


  includes = [
    { title: 'Design & Struktur', text: 'Startlayout (Wireframe), 1–2 Designrunden, klare Typografie und Abstände.' },
    { title: 'Umsetzung (Angular/TS)', text: 'Saubere Komponenten, responsive Layout, schnelle Ladezeiten.' },
    { title: 'Inhalte', text: 'Einbindung von Text/Bild (bereitgestellt). Leichte Anpassbarkeit.' },
    { title: 'Basis-SEO', text: 'Saubere Headings, Meta-Daten, sinnvolle URLs, Core-Web-Vitals im Blick.' },
    { title: 'Formulare & Tracking (Basis)', text: 'Kontaktformular, Consent-Banner (sofern benötigt), DSGVO-konform nach Absprache.' },
    { title: 'Deployment & Übergabe', text: 'Build, Deployment (z. B. Docker), kurze Übergabedoku.' }
  ];

    faq = [
    { q: 'Wie schnell ist das online?', a: ['Typisch 1–3 Wochen – abhängig von Inhalten und Feedbackgeschwindigkeit.'] },
    { q: 'Kann ich später ausbauen?', a: ['Ja. Abschnitte und Unterseiten lassen sich ergänzen. Für größere Strukturen empfehle ich „Große Website“.'] },
    { q: 'Wer pflegt die Inhalte?', a: ['Entweder du selbst (kurze Einweisung) oder ich übernehme Updates nach Absprache.'] }
  ];

}
