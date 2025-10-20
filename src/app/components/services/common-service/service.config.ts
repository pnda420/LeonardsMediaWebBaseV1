import { ServiceConfig } from "./service.interface";


export const SERVICE_CONFIGS: { [key: string]: ServiceConfig } = {
  'one-pager': {
    pageTitle: 'Starter',
    slug: 'one-pager',
    hero: {
      badge: {
        icon: '⚡',
        text: 'Sofort loslegen',
        variant: 'primary'
      },
      title: 'Eine Seite. Alles drauf.',
      description: 'Wer du bist. Was du anbietest. Wie man dich erreicht. <strong>Fertig.</strong>',
      image: 'assets/cards/simple-min.png',
      facts: {
        price: '1.490€',
        timeline: '2 Wochen',
        highlight: 'Mobile perfekt'
      },
      guarantee: 'Kein Risiko · Fester Preis'
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
        note: 'Dann schau dir <a href="/services/standard-website">Standard</a> oder <a href="/services/individual-website">Individual</a> an.'
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
        text: 'Meistgewählt',
        variant: 'star'
      },
      title: 'Richtige Website. Volle Kontrolle.',
      description: '3-8 Seiten. Eigener Blog. <strong>Alles was eine echte Website braucht.</strong>',
      image: 'assets/cards/standard-min.png',
      facts: {
        price: '3.500€',
        timeline: '3-6 Wochen',
        highlight: 'Für Wachstum gemacht'
      },
      guarantee: 'Transparenter Preis · Keine Überraschungen'
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
        note: '💡 Für andere Projekte: <a href="/services/one-pager">Starter</a> oder <a href="/services/individual-website">Individual</a>'
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
        text: 'Alles möglich',
        variant: 'premium'
      },
      title: 'Sag was du willst. Wir bauen\'s.',
      description: 'Login-Bereiche? Check. Buchungssystem? Check. Verrückte Idee die es so noch nicht gibt? <strong>Check.</strong> Von Planung bis Launch – du machst nichts, wir machen alles.',
      image: 'assets/cards/individual-min.png',
      facts: {
        price: 'Ab 5.000€',
        timeline: 'So schnell wie möglich',
        highlight: 'Zero Stress für dich'
      },
      guarantee: 'Festpreis · Keine Überraschungen'
    },
    infoBox: {
      type: 'comparison',
      title: 'Standard reicht nicht? Dann das hier:',
      items: [
        {
          title: 'Standard (3.500 €)',
          features: [
            'Website mit paar Seiten',
            'Bewährte Struktur',
            'Schnell fertig'
          ]
        },
        {
          title: 'Individual (ab 5.000 €)',
          features: [
            'Alles was du brauchst',
            'Nichts was du nicht brauchst',
            'Gebaut für dich, nicht für alle',
            'Wächst mit dir mit'
          ],
          highlight: true
        }
      ]
    },
    useCases: [
      {
        icon: '🎯',
        title: 'Was auch immer',
        description: 'Buchungen, Mitgliederbereiche, Kalender, Dashboards, Automatisierung. Wenn du sagst "Geht das?" sagen wir "Klar".'
      },
      {
        icon: '🔗',
        title: 'Läuft zusammen',
        description: 'Google Kalender, Zoom, Stripe, E-Mail. Alles redet miteinander. Keine manuelle Arbeit mehr.'
      },
      {
        icon: '⚡',
        title: 'Spart Zeit',
        description: 'Automatische E-Mails, Erinnerungen, Reports. Du schläfst, deine Website arbeitet.'
      },
      {
        icon: '🔒',
        title: 'Geschützt',
        description: 'Login für Kunden, Mitarbeiter, Premium-Member. Jeder sieht nur was er darf.'
      },
      {
        icon: '📊',
        title: 'Überblick',
        description: 'Dashboard mit deinen Zahlen. Wer bucht? Wann? Wie viel? Alles auf einen Blick.'
      }
    ],
    techStack: [
      { category: 'Das Wichtige', technologies: ['Schnell', 'Sicher', 'Funktioniert'] }
    ],
    fit: {
      good: {
        title: 'Perfekt für dich wenn',
        items: [
          'Standard zu <strong>langweilig</strong> ist',
          'Du was <strong>Spezielles</strong> brauchst',
          'Zeit = Geld ist bei dir <strong>wörtlich gemeint</strong>',
          'Du <strong>wachsen</strong> willst',
          'Du keine Lust auf <strong>Kompromisse</strong> hast'
        ]
      },
      warning: {
        title: 'Brauchst du wahrscheinlich nicht wenn',
        items: [
          'Eine normale Website <strong>völlig reicht</strong>',
          'Budget unter 5.000 €',
          'In 2 Wochen fertig sein muss',
          'Du nur <strong>"online sein"</strong> willst'
        ],
        note: '💡 Dann lieber: <a href="/services/one-pager">Starter</a> oder <a href="/services/standard-website">Standard</a>'
      }
    },
    includes: [
      {
        title: 'Wir hören zu',
        text: 'Was willst du? Was nervt dich aktuell? Was wäre perfekt? Wir nehmen uns Zeit und denken mit.'
      },
      {
        title: 'Wir planen',
        text: 'Wie muss das aussehen? Welche Features? In welcher Reihenfolge? Du bekommst klares Konzept mit Festpreis.'
      },
      {
        title: 'Wir designen',
        text: 'Wie es aussehen soll, zeigen wir vorher. Klickbare Version zum Testen. Ändern bis du sagst "genau so".'
      },
      {
        title: 'Wir bauen',
        text: 'Frontend, Backend, Datenbank. Alles aus einer Hand. Du siehst Fortschritt, gibst Feedback, wir setzen um.'
      },
      {
        title: 'Wir verbinden',
        text: 'Kalender, E-Mail, Payment, was auch immer. Alles spricht miteinander, automatisch.'
      },
      {
        title: 'Wir testen',
        text: 'Funktioniert alles? Ist es schnell? Ist es sicher? Erst wenn alles perfekt ist, geht\'s online.'
    },
      {
        title: 'Wir launchen',
        text: 'Domain, Hosting, Setup. Du drückst keinen Button, wir machen das.'
      },
      {
        title: 'Wir erklären',
        text: 'Persönliche Einführung. Wie bedienst du was? Wo findest du was? Bis du sicher bist.'
      },
      {
        title: 'Wir bleiben da',
        text: '30 Tage Support nach Start. Frage? Problem? Wir antworten schnell. Optional: Langzeit-Betreuung.'
      },
      {
        title: 'Wir denken voraus',
        text: 'Neue Idee in 6 Monaten? Kein Problem. Wir bauen so dass später alles dazu kann.'
      }
    ],
    process: [
      {
        number: '1',
        title: 'Quatschen',
        description: 'Kostenlos. Unverbindlich. Was brauchst du? Wie viel kostet das ungefähr? Wie lange dauert das?'
      },
      {
        number: '2',
        title: 'Konzept',
        description: 'Wir schreiben auf was genau gebaut wird. Mit Preis. Mit Timeline. Entweder du sagst ja oder nein. Kein Druck.'
      },
      {
        number: '3',
        title: 'Design',
        description: 'So soll es aussehen. Klickbar zum Testen. Passt nicht? Ändern wir. Passt? Weiter.'
      },
      {
        number: '4',
        title: 'Bauen',
        description: 'Wir entwickeln. Du siehst Fortschritt. Alle 1-2 Wochen zeigen wir was fertig ist. Feedback? Gerne.'
      },
      {
        number: '5',
        title: 'Testen',
        description: 'Alles checken. Schnell genug? Sicher genug? Funktioniert alles? Ja? Gut. Nein? Fixen.'
      },
      {
        number: '6',
        title: 'Live',
        description: 'Online. Läuft. Wir zeigen dir wie du es bedienst. 30 Tage sind wir da falls was ist.'
      }
    ],
    faq: [
      {
        q: 'Wie lange dauert das?',
        a: [
          'Kommt drauf an. Meist 2-4 Monate.',
          'Kleine Sache? Geht schneller. Große Sache? Dauert länger.',
          'Nach dem ersten Gespräch sagen wir dir genau wie lange.'
        ]
      },
      {
        q: 'Was kostet das?',
        a: [
          'Startet bei 5.000 €. Nach oben offen.',
          'Hängt davon ab was du brauchst. Mehr Features = mehr Geld.',
          'Du bekommst Festpreis nach Konzept. Keine Überraschungen später.'
        ]
      },
      {
        q: 'Kann ich später mehr Features haben?',
        a: [
          'Ja. Wir bauen so dass du später erweitern kannst.',
          'Neue Idee? Sag Bescheid, wir bauen dazu.'
        ]
      },
      {
        q: 'Muss ich was können?',
        a: [
          'Nein. Null Technik-Wissen nötig.',
          'Du sagst was du willst, wir bauen es.',
          'Am Ende zeigen wir dir wie du es bedienst. Easy.'
        ]
      },
      {
        q: 'Macht ihr auch Online-Shops?',
        a: [
          'Nein. Shops sind nicht unser Ding.',
          'Alles andere aber schon.'
        ]
      },
      {
        q: 'Was ist wenn mir was nicht gefällt?',
        a: [
          'Sag\'s. Wir ändern es.',
          'Design, Farben, Texte, alles anpassbar.',
          'Erst wenn du zufrieden bist, geht\'s weiter.'
        ]
      },
      {
        q: 'Gehört mir das dann?',
        a: [
          'Ja. Kompletter Code gehört dir.',
          'Willst du später selbst weitermachen? Kannst du.',
          'Willst du anderen Entwickler ranlassen? Kannst du.'
        ]
      },
      {
        q: 'Was ist nach Launch?',
        a: [
          '30 Tage Support inklusive.',
          'Danach: Optional Wartungsvertrag. Oder du machst selbst weiter.',
          'Deine Wahl.'
        ]
      }
    ],
    cta: {
      title: 'Lass uns reden',
      description: 'Kostenlos. Unverbindlich. Kein Sales-Gelaber. Ehrliche Einschätzung ob und wie das geht.',
      benefits: [
        'Was geht, was nicht',
        'Grob was es kostet',
        'Grob wie lange es dauert',
        'Null Risiko'
      ]
    }
  }
};