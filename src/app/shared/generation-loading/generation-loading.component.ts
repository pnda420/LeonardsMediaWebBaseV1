import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-generation-loading',
  standalone: true,
  imports: [],
  templateUrl: './generation-loading.component.html',
  styleUrl: './generation-loading.component.scss'
})
export class GenerationLoadingComponent implements OnInit, OnDestroy {
  currentThought: string = '';
  currentEmoji: string = '🎨';
  private thoughtInterval?: any;
  private emojiInterval?: any;

  // 🤖 Fake AI Thoughts
  private thoughts = [
    '🎨 Analysiere deine Design-Präferenzen...',
    '✨ Erstelle einzigartiges Layout-Konzept...',
    '🎯 Optimiere User Experience...',
    '💎 Verfeinere visuelle Hierarchie...',
    '🚀 Generiere modernen, sauberen Code...',
    '🔮 Integriere Animationen und Effekte...',
    '🌟 Poliere letzte Details...',
    '⚡ Fast geschafft...',
    '🎉 Finalisiere dein Meisterwerk...'
  ];

  private emojis = ['🎨', '✨', '🎯', '💎', '🚀', '🔮', '🌟', '⚡'];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.startThoughts();
    this.startEmojiRotation();
  }

  ngOnDestroy(): void {
    if (this.thoughtInterval) clearInterval(this.thoughtInterval);
    if (this.emojiInterval) clearInterval(this.emojiInterval);
  }

  private startThoughts(): void {
    let index = 0;
    this.currentThought = this.thoughts[0];

    // Wechsle Gedanken alle 3 Sekunden
    this.thoughtInterval = setInterval(() => {
      index = (index + 1) % this.thoughts.length;
      this.currentThought = this.thoughts[index];
    }, 3000);
  }

  private startEmojiRotation(): void {
    let index = 0;
    
    // Wechsle Emoji alle 2.5 Sekunden
    this.emojiInterval = setInterval(() => {
      index = (index + 1) % this.emojis.length;
      this.currentEmoji = this.emojis[index];
    }, 2500);
  }

  goToPreview(): void {
    this.router.navigate(['/preview']);
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }

  createNew(): void {
    this.router.navigate(['/preview-form']);
  }
}