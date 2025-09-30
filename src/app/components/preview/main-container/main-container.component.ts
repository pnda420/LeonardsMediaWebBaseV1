import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { Router } from '@angular/router';
import { ContentComponent, MainContent } from "../content/content.component";

@Component({
  selector: 'app-main-container',
  standalone: true,
  imports: [HeaderComponent, ContentComponent],
  templateUrl: './main-container.component.html',
  styleUrl: './main-container.component.scss'
})
export class MainContainerComponent {

  constructor(private router: Router) { }

  goBack() {
    this.router.navigate(['/']);
  }


  contentExample1: MainContent =  {
    "type": "landing",
    "blocks": [
      {
        "type": "hero",
        "title": "Willkommen auf unserer Plattform",
        "subtitle": "Alles was du brauchst an einem Ort",
        "image": { "src": "https://picsum.photos/800/400", "alt": "Hero Bild" },
        "ctas": [
          { "kind": "primary", "label": "Jetzt starten", "href": "/signup" }
        ]
      },
      {
        "type": "valueProps",
        "items": [
          { "icon": "🚀", "title": "Schnell", "text": "Starte in Minuten, nicht Tagen." },
          { "icon": "🔒", "title": "Sicher", "text": "Deine Daten bleiben geschützt." },
          { "icon": "⚡", "title": "Effizient", "text": "Automatisiere deine Abläufe." }
        ]
      },
      {
        "type": "pricing",
        "note": "Alle Preise inkl. MwSt.",
        "plans": [
          {
            "name": "Starter",
            "price": "9€/Monat",
            "desc": "Für Einzelanwender",
            "features": ["1 Projekt", "E-Mail Support"],
            "cta": { "label": "Wählen", "href": "/checkout/starter" }
          },
          {
            "name": "Pro",
            "price": "29€/Monat",
            "desc": "Für Teams",
            "features": ["Unbegrenzte Projekte", "24/7 Support"],
            "cta": { "label": "Wählen", "href": "/checkout/pro" }
          }
        ]
      },
      {
        "type": "faq",
        "items": [
          { "q": "Kann ich jederzeit kündigen?", "a": ["Ja, monatlich kündbar."] },
          { "q": "Gibt es einen Testzeitraum?", "a": ["Ja, 14 Tage kostenlos."] }
        ]
      },
      {
        "type": "cta",
        "title": "Bereit loszulegen?",
        "subtitle": "Starte kostenlos und ohne Risiko.",
        "primary": { "label": "Kostenlos testen", "href": "/signup" },
        "secondary": { "label": "Kontakt", "href": "/contact" }
      }
    ]
  }

  contentExample2: MainContent = {
    "type": "portfolio",
    "blocks": [
      {
        "type": "hero",
        "title": "Hi, ich bin Alex",
        "subtitle": "Full-Stack Entwickler & Designer",
        "image": { "src": "https://picsum.photos/600/400", "alt": "Profilfoto" },
        "ctas": [
          { "kind": "primary", "label": "Projekte ansehen", "href": "#projects" }
        ]
      },
      {
        "type": "skills",
        "items": ["Angular", "TypeScript", "Node.js", "Docker", "Kubernetes"]
      },
      {
        "type": "projects",
        "items": [
          {
            "title": "E-Commerce Plattform",
            "summary": "Skalierbare Lösung für Online-Shops",
            "tags": ["Angular", "NestJS"],
            "image": { "src": "https://picsum.photos/400/200", "alt": "Projektbild" },
            "links": [{ "label": "Live Demo", "href": "https://example.com" }]
          },
          {
            "title": "Portfolio Website",
            "summary": "Minimalistisches Design & Performance",
            "tags": ["Next.js", "TailwindCSS"],
            "image": { "src": "https://picsum.photos/400/201", "alt": "Projektbild" }
          }
        ]
      },
      {
        "type": "about",
        "title": "Über mich",
        "text": "Ich baue performante Web-Anwendungen und liebe sauberen Code.",
        "facts": [
          { "k": "Standort", "v": "Berlin" },
          { "k": "Erfahrung", "v": "5 Jahre" }
        ]
      },
      {
        "type": "services",
        "items": [
          { "title": "Web Development", "text": "Von Prototyp bis Produktion." },
          { "title": "UI/UX Design", "text": "Benutzerfreundliche Interfaces." }
        ]
      },
      {
        "type": "contact",
        "headline": "Lass uns sprechen!",
        "text": "Schreib mir direkt oder ruf an.",
        "channels": [
          { "type": "mail", "label": "E-Mail", "value": "alex@example.com" },
          { "type": "tel", "label": "Telefon", "value": "+49123456789" },
          { "type": "link", "label": "LinkedIn", "value": "https://linkedin.com/in/alex" }
        ]
      }
    ]
  }

  contentExample3: MainContent = {
    "type": "event",
    "blocks": [
      {
        "type": "hero",
        "title": "Tech Conference 2025",
        "subtitle": "Die Zukunft der Softwareentwicklung",
        "datetime": { "start": "2025-11-20T09:00:00", "end": "2025-11-22T18:00:00" },
        "location": { "name": "Berlin Congress Center", "address": "Alexanderstr. 11, Berlin" },
        "ctas": [{ "kind": "primary", "label": "Tickets sichern", "href": "#tickets" }]
      },
      {
        "type": "schedule",
        "items": [
          { "time": "09:00", "title": "Keynote: The Future", "desc": "Eröffnung durch CEO" },
          { "time": "11:00", "title": "Workshop: AI in Practice", "track": "AI" }
        ]
      },
      {
        "type": "speakers",
        "items": [
          {
            "name": "Dr. Sarah Müller",
            "role": "AI Researcher",
            "bio": "Arbeitet bei OpenAI an generativer KI.",
            "photo": { "src": "https://picsum.photos/200", "alt": "Speaker" },
            "links": [{ "label": "Twitter", "href": "https://twitter.com/sarah" }]
          },
          {
            "name": "Tom Becker",
            "role": "CTO",
            "bio": "Leitet die Tech-Strategie bei StartupX."
          }
        ]
      },
      {
        "type": "venue",
        "map": {
          "embedUrl": "https://maps.google.com/maps?q=Berlin&t=&z=13&ie=UTF8&iwloc=&output=embed"
        },
        "notes": "Mit U2, S-Bahn Jannowitzbrücke erreichbar."
      },
      {
        "type": "tickets",
        "plans": [
          {
            "name": "Standard",
            "price": "199€",
            "desc": "Zugang zu allen Vorträgen",
            "cta": { "label": "Kaufen", "href": "/checkout/standard" }
          },
          {
            "name": "VIP",
            "price": "499€",
            "desc": "Mit Zugang zur Speaker-Lounge",
            "cta": { "label": "Kaufen", "href": "/checkout/vip" }
          }
        ]
      },
      {
        "type": "faq",
        "items": [
          { "q": "Gibt es Studentenrabatte?", "a": ["Ja, 50% mit gültigem Ausweis."] },
          { "q": "Sind Mahlzeiten enthalten?", "a": ["Ja, Mittagessen ist inklusive."] }
        ]
      },
      {
        "type": "cta",
        "title": "Jetzt Ticket sichern!",
        "primary": { "label": "Tickets kaufen", "href": "#tickets" }
      }
    ]
  }
  
  

}
