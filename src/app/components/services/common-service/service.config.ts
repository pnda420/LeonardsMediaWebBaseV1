import { ServiceConfig } from "./service.interface";


export const SERVICE_CONFIGS: { [key: string]: ServiceConfig } = {
  'one-pager': {
    pageTitle: 'Starter',
    slug: 'one-pager',
    hero: {
      badge: {
        icon: '🚀',
        text: 'Schnellstart',
        variant: 'primary'
      },
      title: 'Eine Seite. Alles drauf. Fertig in 2 Wochen.',
      description: 'Dein Angebot, deine Vorteile, Kontaktmöglichkeit - <strong>alles auf einer Seite</strong>. Perfekt für den schnellen Start.',
      image: 'assets/cards/simple-min.png',
      facts: {
        price: 'Ab 1.490€',
        timeline: 'Fertig in 1-2 Wochen',
        highlight: 'Auf Handy perfekt'
      },
      guarantee: 'Fester Preis · 14 Tage Geld-zurück'
    },
    infoBox: {
      type: 'ki',
      title: 'Probier\'s aus: Gratis Vorschau',
      content: 'Sag mir in 2 Sätzen was du machst. Ich zeig dir sofort wie deine Website aussehen könnte - gratis.'
    },
    fit: {
      good: {
        title: 'Perfekt, wenn du...',
        items: [
          'Schnell online sein willst (1-2 Wochen)',
          'Ein klares Angebot hast',
          'Leute sollen dich kontaktieren',
          'Nicht viel Text brauchst',
          'Ein festes Budget hast'
        ]
      },
      warning: {
        title: 'Nicht passend, wenn du...',
        items: [
          'Viele verschiedene Seiten brauchst',
          'Einen Online-Shop willst',
          'Komplizierte Formulare brauchst',
          'Login für Mitglieder willst',
          'Die Seite in mehreren Sprachen brauchst'
        ],
        note: 'Dann schau dir <a href="/services/standard-website">Business</a> oder <a href="/services/individual-website">Premium</a> an.'
      }
    },
    includes: [
      { title: 'Alle Bereiche die du willst', text: 'Über uns, Angebot, Vorteile, Kontakt - du sagst mir was rein soll.' },
      { title: 'Kontaktformular', text: 'Kunden können dir direkt schreiben. Du bekommst die Nachricht per E-Mail.' },
      { title: 'Auf Handy perfekt', text: 'Sieht auf Handy, Tablet und Computer super aus. Automatisch angepasst.' },
      { title: 'Bei Google findbar', text: 'Ich optimiere alles damit deine Kunden dich bei Google finden.' },
      { title: 'Deine Farben & Style', text: 'Du sagst mir welche Farben und welchen Look du willst. Ich setze es um.' },
      { title: '3 Monate Support gratis', text: 'Fehler beheben, kleine Änderungen - ich helfe dir die ersten 3 Monate kostenlos.' }
    ],
    process: [
      { number: '1', title: 'Wir reden (30 Min)', description: 'Du erzählst was du brauchst. Ich sage dir ehrlich ob es passt.' },
      { number: '2', title: 'Ich zeig dir einen Entwurf', description: 'Du siehst wie es aussehen wird. Passt nicht? Ich ändere es.' },
      { number: '3', title: 'Ich baue die Website', description: 'Du kannst zwischendurch schauen und Feedback geben.' },
      { number: '4', title: 'Website geht live', description: 'Ich mache sie online. Du bekommst alles erklärt.' }
    ],
    faq: [
      { q: 'Wie lange dauert es wirklich?', a: ['Meistens 1-2 Wochen. Wenn du mir schnell die Infos und Bilder gibst, gehts schneller. Wenn du länger brauchst, ist das auch ok.'] },
      { q: 'Was kostet es genau?', a: ['Ab 1.490€. Das ist der Festpreis. Keine versteckten Kosten. Wenn du Extras willst, sage ich dir vorher was es kostet.'] },
      { q: 'Muss ich die Texte selbst schreiben?', a: ['Ja, du gibst mir die Texte. Ich helfe dir aber gerne dabei und sage dir was gut funktioniert. Wenn du willst, kann ich auch jemanden empfehlen der Texte schreibt.'] },
      { q: 'Kann ich später was ändern?', a: ['Klar! Die ersten 3 Monate mache ich kleine Änderungen gratis. Danach können wir einen Support-Vertrag machen oder ich rechne nach Aufwand ab.'] },
      { q: 'Was ist mit Hosting und Domain?', a: ['Ich helfe dir dabei und erkläre alles. Das kostet extra (ca. 5-15€ im Monat), aber ich sage dir vorher genau was.'] }
    ],
    cta: {
      title: 'Lass uns starten!',
      description: 'Wir reden 30 Minuten über dein Projekt. Kostet nix, keine Pflicht.',
      benefits: [
        'Ich sage dir ehrlich ob es passt',
        'Du weißt danach genau was es kostet',
        'Kein Verkaufsdruck - versprochen'
      ]
    }
  },

  'standard-website': {
    pageTitle: 'Standard',
    slug: 'standard-website',
    hero: {
      badge: {
        icon: '⭐',
        text: 'Empfohlen',
        variant: 'star'
      },
      title: 'Mehrere Seiten. Strukturiert. Professionell.',
      description: 'Eine <strong>vollständige Website</strong> mit mehreren Unterseiten für strukturierte Inhalte. Professionelle Navigation, Blog-Option, erweiterte SEO.',
      image: 'assets/cards/standard-min.png',
      facts: {
        price: 'Ab 3.500€',
        timeline: 'Live in 3–6 Wochen',
        highlight: '3–8 Unterseiten'
      },
      guarantee: 'Keine versteckten Kosten · 14 Tage Zufriedenheitsgarantie'
    },
    infoBox: {
      type: 'comparison',
      title: '🔄 Unterschied zur einfachen Website',
      items: [
        {
          title: 'Einfache Website (1.800€)',
          features: [
            'Eine Seite, 3-6 Abschnitte',
            'Schneller Start (1-3 Wochen)',
            'Basis-Funktionen'
          ]
        },
        {
          title: 'Standard Website (3.500€)',
          features: [
            '3-8 separate Unterseiten',
            'Navigation & Footer',
            'Blog-System (optional)',
            'Erweiterte SEO & Analytics'
          ],
          highlight: true
        }
      ]
    },
    typicalPages: [
      { icon: 'home', title: 'Startseite', description: 'Übersicht, Highlights, Call-to-Actions' },
      { icon: 'person', title: 'Über uns', description: 'Team, Geschichte, Werte' },
      { icon: 'bolt', title: 'Leistungen', description: 'Detaillierte Services' },
      { icon: 'work', title: 'Referenzen', description: 'Projekte, Portfolio' },
      { icon: 'article', title: 'Blog/News', description: 'Artikel, Updates (optional)' },
      { icon: 'mail', title: 'Kontakt', description: 'Formular, Anfahrt, Daten' }
    ],
    fit: {
      good: {
        title: 'Perfekt geeignet',
        items: [
          'Du hast <strong>mehrere Themenbereiche</strong> (Über uns, Leistungen, Referenzen)',
          'Du willst <strong>regelmäßig Content</strong> veröffentlichen (Blog, News)',
          'Du brauchst <strong>gute Auffindbarkeit</strong> bei Google',
          'Professioneller Auftritt ist wichtig',
          'Mittleres bis großes Budget'
        ]
      },
      warning: {
        title: 'Eher nicht geeignet',
        items: [
          'Du brauchst nur <strong>eine einfache Visitenkarte</strong>',
          '<strong>Online-Shop</strong> mit Warenwirtschaft',
          'Komplexe Web-Anwendungen mit Login',
          'Mehrsprachige Versionen',
          'Sehr knappes Budget (unter 3.000€)'
        ],
        note: '💡 Für andere Projekte: <a href="/services/one-pager">Einfache Website</a> oder <a href="/services/individual-website">Individual Website</a>'
      }
    },
    includes: [
      { title: 'Umfassende Planung', text: 'Strategie-Workshop zur Definition von Zielen, Zielgruppe und Seitenstruktur. Content-Strategie für alle Bereiche.' },
      { title: 'Professionelles Design', text: 'Individuelle Designs für alle wichtigen Seiten. Wireframes, Mockups, 2-3 Feedback-Runden bis alles perfekt ist.' },
      { title: '3-8 Unterseiten', text: 'Flexible Struktur je nach Bedarf: Startseite, Über uns, Leistungen, Referenzen, Blog, Kontakt. Alles mobil optimiert.' },
      { title: 'Navigation & Footer', text: 'Intuitive Hauptnavigation, strukturierter Footer mit allen wichtigen Links, Breadcrumbs bei Bedarf.' },
      { title: 'Blog-System (optional)', text: 'Einfaches CMS für News, Artikel oder Updates. Du kannst selbst Beiträge erstellen und veröffentlichen.' },
      { title: 'Saubere Entwicklung', text: 'Moderne Umsetzung mit Angular/TypeScript. Wartbarer Code, schnelle Ladezeiten, optimierte Performance.' },
      { title: 'Erweiterte SEO', text: 'On-Page-Optimierung für alle Seiten, strukturierte Daten, Sitemap, optimierte Meta-Daten, SEO-Audit nach Launch.' },
      { title: 'Kontaktformulare', text: 'Mehrere Formulare möglich (Kontakt, Anfrage, Newsletter). Spam-Schutz, E-Mail-Benachrichtigungen.' },
      { title: 'Analytics & Tracking', text: 'Google Analytics oder Alternative, Conversion-Tracking, Cookie-Banner DSGVO-konform.' },
      { title: 'Content-Integration', text: 'Einbindung deiner Texte, Bilder und Videos. Optional: Unterstützung bei Content-Erstellung.' },
      { title: 'Testing & Launch', text: 'Ausführliche Tests auf allen Geräten, Browser-Kompatibilität, Performance-Check, professioneller Go-Live.' },
      { title: 'Schulung & Übergabe', text: 'Einweisung ins CMS (falls Blog), Dokumentation für Updates, 14 Tage Support nach Launch inklusive.' }
    ],
    process: [
      { number: '1', title: 'Strategie-Workshop', description: '60–90 Min: Ziele definieren, Zielgruppe analysieren, Seitenstruktur planen.' },
      { number: '2', title: 'Design-Konzept', description: 'Wireframes und Mockups für wichtige Seiten. 2–3 Feedback-Runden inklusive.' },
      { number: '3', title: 'Content-Erstellung', description: 'Du lieferst Texte und Bilder. Gemeinsame Abstimmung der Inhalte.' },
      { number: '4', title: 'Entwicklung', description: 'Professionelle Umsetzung. Responsiv, schnell, suchmaschinenoptimiert.' },
      { number: '5', title: 'Testing & Launch', description: 'Ausführliche Tests auf allen Geräten. SEO-Check, Performance-Optimierung.' },
      { number: '6', title: 'Schulung & Support', description: 'Einweisung ins Content-Management. Optional: laufender Support.' }
    ],
    faq: [
      { q: 'Wie lange dauert die Umsetzung?', a: ['Typischerweise 3-6 Wochen, abhängig von der Anzahl der Seiten und Content-Bereitstellung.', 'Nach dem Kickoff erstelle ich einen detaillierten Zeitplan mit Meilensteinen.'] },
      { q: 'Muss ich die Texte selbst schreiben?', a: ['Idealerweise ja - du kennst dein Business am besten.', 'Ich kann aber bei der Struktur helfen oder Texte überarbeiten.', 'Professionelles Copywriting kann ich gegen Aufpreis vermitteln.'] },
      { q: 'Kann ich später selbst Inhalte ändern?', a: ['Bei statischen Seiten: Änderungen über mich oder mit technischem Know-how.', 'Mit Blog-System: Ja, du kannst Beiträge selbst erstellen und bearbeiten.', 'Kleine Textänderungen auf Anfrage oft kostenlos in den ersten Wochen.'] },
      { q: 'Brauche ich ein Blog?', a: ['Nicht zwingend. Ein Blog hilft bei SEO und zeigt Expertise.', 'Macht nur Sinn, wenn du regelmäßig Content veröffentlichen willst.', 'Wir besprechen im Kickoff, was für dich sinnvoll ist.'] }
    ],
    cta: {
      title: 'Bereit für deine Website?',
      description: 'Kostenloses Erstgespräch - wir klären, ob das Paket zu deinem Projekt passt.',
      benefits: [
        '30 Min unverbindliches Gespräch',
        'Klare Einschätzung von Aufwand & Kosten',
        'Keine Verpflichtung, kein Sales-Druck'
      ]
    }
  },

  'individual-website': {
    pageTitle: 'Individual',
    slug: 'individual-website',
    hero: {
      badge: {
        icon: '💎',
        text: 'Premium',
        variant: 'premium'
      },
      title: 'Maßgeschneidert. Skalierbar. Einzigartig.',
      description: 'Eine <strong>komplett individuelle Web-Anwendung</strong> nach deinen spezifischen Anforderungen. Custom Features, API-Integrationen, Datenbanken, Mitgliederbereiche. Für Projekte, die mehr als eine Standard-Website brauchen.',
      image: 'assets/cards/individual-min.png',
      facts: {
        price: 'Ab 5.000 €',
        timeline: 'Projektdauer nach Umfang',
        highlight: 'Unbegrenzte Möglichkeiten'
      },
      guarantee: 'Festpreis nach Konzeptphase · Premium-Support inklusive'
    },
    infoBox: {
      type: 'comparison',
      title: '🔄 Unterschied zu anderen Paketen',
      items: [
        {
          title: 'Standard Website (3.500 €)',
          features: [
            '3-8 vordefinierte Seiten',
            'Standard-Features',
            'Templates & bewährte Patterns'
          ]
        },
        {
          title: 'Individual Website (ab 5.000 €)',
          features: [
            'Unbegrenzte Funktionen',
            'Eigene Datenbank-Strukturen',
            'Custom APIs & Integrationen',
            'Login-Systeme & Benutzerrollen',
            'Komplett nach deinen Specs'
          ],
          highlight: true
        }
      ]
    },
    useCases: [
      { icon: '🏋️', title: 'Buchungssysteme', description: 'Fitnessstudio-Buchungen, Terminvergabe, Raumbuchungen mit Kalenderintegration und automatischen Benachrichtigungen' },
      { icon: '👥', title: 'Mitgliederplattformen', description: 'Geschützte Bereiche, verschiedene Nutzerrollen, Dokumentenverwaltung, Forum oder Community-Features' },
      { icon: '📊', title: 'Verwaltungstools', description: 'Interne Tools für Kundenverwaltung, Projekttracking, Zeiterfassung oder Ressourcenplanung' },
      { icon: '🔗', title: 'System-Integrationen', description: 'Anbindung an Warenwirtschaft, CRM, Payment-Provider oder andere externe Dienste via API' },
      { icon: '📱', title: 'Portale & Dashboards', description: 'Kundenportale mit individuellen Dashboards, Reports und Datenvisualisierungen' }
    ],
    techStack: [
      { category: 'Frontend', technologies: ['Angular', 'TypeScript', 'Responsive Design'] },
      { category: 'Backend', technologies: ['Node.js', 'NestJS', 'REST APIs'] },
      { category: 'Datenbank', technologies: ['PostgreSQL', 'TypeORM', 'Redis Cache'] },
      { category: 'Infrastruktur', technologies: ['Docker', 'CI/CD', 'Cloud Hosting'] }
    ],
    fit: {
      good: {
        title: 'Perfekt geeignet',
        items: [
          'Du brauchst <strong>spezielle Features</strong>, die es nicht von der Stange gibt',
          '<strong>Datenbank-getriebene</strong> Anwendungen (CRM, Verwaltungssysteme)',
          '<strong>Login-Bereiche</strong> mit verschiedenen Nutzerrollen',
          '<strong>API-Integrationen</strong> zu externen Systemen',
          'Komplexe <strong>Buchungs- oder Reservierungssysteme</strong>',
          '<strong>Skalierbare Lösungen</strong> für wachsende Anforderungen'
        ]
      },
      warning: {
        title: 'Eher nicht geeignet',
        items: [
          'Du brauchst nur eine <strong>einfache Präsenz</strong> im Web',
          'Standard-Features reichen völlig aus',
          'Budget unter 5.000 €',
          'Projekt muss in 2-3 Wochen fertig sein',
          'Keine technischen Anforderungen bekannt'
        ],
        note: '💡 Für einfachere Projekte: <a href="/services/one-pager">Einfache Website</a> oder <a href="/services/standard-website">Standard Website</a>'
      }
    },
    includes: [
      { title: 'Ausführliche Analyse', text: 'Discovery-Phase mit User Stories, Datenmodell-Design, technischer Architektur. Detailliertes Konzept vor Start.' },
      { title: 'Custom Design & UX', text: 'Individuelle UI/UX-Designs, klickbare Prototypen, mehrere Feedback-Runden bis alles perfekt sitzt.' },
      { title: 'Vollständige Entwicklung', text: 'Frontend (Angular/TS), Backend (Node.js/NestJS), Datenbank (PostgreSQL). Sauberer, wartbarer Code nach Best Practices.' },
      { title: 'Custom Features', text: 'Login-Systeme, Benutzerrollen, Dashboards, komplexe Formulare, Buchungssysteme - was immer du brauchst.' },
      { title: 'API-Integrationen', text: 'Anbindung externer Dienste (Payment, CRM, E-Mail, etc.). REST-APIs für eigene Schnittstellen.' },
      { title: 'Datenbank & Backend', text: 'PostgreSQL-Setup mit Migrations, Caching (Redis), optimierte Queries, Backup-Strategie.' },
      { title: 'Testing & QA', text: 'Umfangreiche Tests (Unit, Integration, E2E). Performance- und Security-Checks. Bug-Fixing inklusive.' },
      { title: 'Deployment & DevOps', text: 'Docker-Setup, CI/CD-Pipeline, Cloud-Hosting, Monitoring, automatische Deployments.' },
      { title: 'Dokumentation', text: 'Technische Dokumentation, API-Specs, Admin-Anleitung, Code-Kommentare für zukünftige Entwicklung.' },
      { title: 'Schulung & Support', text: 'Einweisung für Admin-Bereiche, 30 Tage Priority-Support nach Launch. Optional: Wartungsvertrag.' },
      { title: 'Skalierbarkeit', text: 'Architektur für Wachstum ausgelegt. Performance-Optimierung, Caching-Strategien, Load-Balancing-Ready.' },
      { title: 'Security & DSGVO', text: 'Sichere Authentifizierung, Datenverschlüsselung, DSGVO-konforme Datenverarbeitung, Security-Audits.' }
    ],
    process: [
      { number: '1', title: 'Discovery-Phase', description: 'Ausführliche Analyse deiner Anforderungen. User Stories, Datenmodelle, technische Architektur. Dauer: 1-2 Wochen.' },
      { number: '2', title: 'Konzept & Angebot', description: 'Detailliertes Konzept mit Festpreis. Mockups, Datenbank-Schema, API-Spezifikation. Klare Phasen und Timelines.' },
      { number: '3', title: 'Design & Prototyping', description: 'UX/UI-Design für alle wichtigen Views. Klickbarer Prototyp zum Testen der User Journey. Feedback-Schleifen.' },
      { number: '4', title: 'Iterative Entwicklung', description: 'Umsetzung in Sprints (2-3 Wochen). Regelmäßige Demos und Reviews. Schrittweise Integration aller Features.' },
      { number: '5', title: 'Testing & QA', description: 'Umfangreiche Tests (Funktional, Performance, Security). Bug-Fixing und Optimierung. User Acceptance Tests.' },
      { number: '6', title: 'Launch & Übergabe', description: 'Deployment in Production. Monitoring-Setup. Dokumentation und Schulung. Optional: Maintenance-Vertrag.' }
    ],
    faq: [
      { q: 'Wie lange dauert so ein Projekt?', a: ['Das hängt stark vom Umfang ab. Typischerweise 8-16 Wochen von Konzept bis Launch.', 'In der Discovery-Phase (1-2 Wochen) erstellen wir einen detaillierten Zeitplan mit Meilensteinen.'] },
      { q: 'Wie wird der Preis kalkuliert?', a: ['Nach der Discovery-Phase bekommst du ein Festpreis-Angebot basierend auf dem finalen Konzept.', 'Basis ab 5.000 €. Komplexere Projekte mit vielen Features können 10.000-30.000 € oder mehr kosten.', 'Transparente Kalkulation - du weißt vorher genau, was es kostet.'] },
      { q: 'Kann ich das Projekt später erweitern?', a: ['Absolut. Die Architektur ist so gebaut, dass neue Features hinzugefügt werden können.', 'Du bekommst den kompletten Quellcode und Dokumentation - auch andere Entwickler können später dran arbeiten.'] }
    ],
    cta: {
      title: 'Bereit für dein individuelles Projekt?',
      description: 'Kostenloses Erstgespräch - wir analysieren deine Anforderungen und entwickeln ein maßgeschneidertes Konzept.',
      benefits: [
        '60 Min Discovery-Gespräch',
        'Technische Machbarkeitsanalyse',
        'Grobe Aufwandsschätzung',
        'Keine Verpflichtung, kein Sales-Druck'
      ]
    }
  }
};