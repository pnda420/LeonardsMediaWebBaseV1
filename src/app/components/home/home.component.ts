import { Component } from '@angular/core';
import { PageTitleComponent } from "../../shared/page-title/page-title.component";
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IconComponent } from "../../shared/icon/icon.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  constructor(public router: Router) { }

  usp = [
    {
      icon: 'rocket_launch',
      title: 'Schnell live',
      text: 'Von der Idee zum fertigen Produkt - ohne monatelange Planungsphasen.'
    },
    {
      icon: 'code',
      title: 'Sauber gebaut',
      text: 'Wartbarer Code, klare Struktur. Dein Projekt bleibt flexibel für die Zukunft.'
    },
    {
      icon: 'handshake',
      title: 'Transparent',
      text: 'Klare Kommunikation, faire Preise, realistische Timelines - kein Sales-Blabla.'
    }
  ];


  typescriptservices = [
    {
      title: 'Frontend-Entwicklung',
      text: 'Moderne Web-Apps mit Angular & TypeScript. Responsive, schnell, intuitiv bedienbar.',
      link: '/services/frontend'
    },
    {
      title: 'Backend & APIs',
      text: 'Sichere REST-APIs mit Node.js. Authentifizierung, Datenvalidierung, Performance-Optimierung.',
      link: '/services/backend'
    },
    {
      title: 'Datenbank & Deployment',
      text: 'PostgreSQL-Setup, automatisierte Deployments, Docker-Container. Alles production-ready.',
      link: '/services/ops'
    }
  ];


}
