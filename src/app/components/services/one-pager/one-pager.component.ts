import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { PageTitleComponent } from '../../../shared/page-title/page-title.component';

@Component({
  selector: 'app-one-pager',
  standalone: true,
  imports: [PageTitleComponent, CommonModule],
  templateUrl: './one-pager.component.html',
  styleUrl: './one-pager.component.scss'
})
export class OnePagerComponent {
  constructor(public router: Router) {}

  // aus deiner Card-Quelle
  title = 'Website One-Pager';
  slug = 'one-pager';
  img  = 'assets/cards/1.png';
  price = 'ab 1.800 €';

  includes = [
    { title: 'Design & Struktur', text: 'Startlayout (Wireframe), 1–2 Designrunden, klare Typografie und Abstände.' },
    { title: 'Umsetzung (Angular/TS)', text: 'Saubere Komponenten, responsive Layout, schnelle Ladezeiten.' },
    { title: 'Inhalte', text: 'Einbindung von Text/Bild (bereitgestellt). Leichte Anpassbarkeit.' },
    { title: 'Basis-SEO', text: 'Saubere Headings, Meta-Daten, sinnvolle URLs, Core-Web-Vitals im Blick.' },
    { title: 'Formulare & Tracking (Basis)', text: 'Kontaktformular, Consent-Banner (sofern benötigt), DSGVO-konform nach Absprache.' },
    { title: 'Deployment & Übergabe', text: 'Build, Deployment (z. B. Docker), kurze Übergabedoku.' }
  ];

  examples = [
    { src: 'assets/cards/1.png', alt: 'One-Pager Beispiel 1', title: 'One-Pager A', meta: 'Services · Kontaktfokus' },
    { src: 'assets/cards/2.png', alt: 'One-Pager Beispiel 2', title: 'One-Pager B', meta: 'Produkt · CTA oben' },
    { src: 'assets/cards/3.png', alt: 'One-Pager Beispiel 3', title: 'One-Pager C', meta: 'Local · Termine' }
  ];

  faq = [
    { q: 'Wie schnell ist das online?', a: ['Typisch 1–3 Wochen – abhängig von Inhalten und Feedbackgeschwindigkeit.'] },
    { q: 'Kann ich später ausbauen?', a: ['Ja. Abschnitte und Unterseiten lassen sich ergänzen. Für größere Strukturen empfehle ich „Große Website“.'] },
    { q: 'Wer pflegt die Inhalte?', a: ['Entweder du selbst (kurze Einweisung) oder ich übernehme Updates nach Absprache.'] }
  ];

  scrollTo(id: string) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
