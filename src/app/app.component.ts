import { Component, Inject, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./shared/header/header.component";
import { FooterComponent } from "./shared/footer/footer.component";
import { SeoService } from './shared/seo.service';
import { CommonModule, DOCUMENT } from '@angular/common';
import { filter } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { MaintenanceComponent } from "./components/maintenance/maintenance.component";
import { ToastContainerComponent } from "./shared/toasts/toast-container.component";
import { ToastService } from './shared/toasts/toast.service';
import { ConfirmationComponent } from "./shared/confirmation/confirmation.component";
import { ConfirmationService } from './shared/confirmation/confirmation.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    CommonModule,
    FormsModule,
    MaintenanceComponent,
    ToastContainerComponent,
    ConfirmationComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'WebsiteBaseV2';
  isUnderConstruction = false;
  private readonly accessPassword = 'lm';

  // Neue Properties für Scroll-Handling
  isScrolled: boolean = false;
  showScrollTop: boolean = false;

  defaultConfig = {
    title: 'Bestätigung',
    message: 'Möchtest du fortfahren?',
    type: 'info' as const
  };

  // WICHTIG: Erst nach defaultConfig deklarieren!
  get confirmationState$() {
    return this.confirmationService.state$;
  }

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private seo: SeoService,
    @Inject(DOCUMENT) private doc: Document,
    private toasts: ToastService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    // Access Control für Under Construction Mode
    this.route.queryParams.subscribe(params => {
      const access = params['pw'];
      if (access === this.accessPassword) {
        this.isUnderConstruction = false;
        this.router.navigate([], { queryParams: { pw: null }, queryParamsHandling: 'merge' });
        sessionStorage.setItem('hasAccess', 'true');
      } else if (sessionStorage.getItem('hasAccess') === 'true') {
        this.isUnderConstruction = false;
      }
    });

    // SEO-Update bei Navigation
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => {
        const deepest = this.getDeepest(this.route);
        const routeTitle: any = deepest.snapshot.routeConfig && (deepest.snapshot.routeConfig as any).title;
        const description = deepest.snapshot.data && deepest.snapshot.data['description'];
        const title = typeof routeTitle === 'string' ? routeTitle : 'LeonardsMedia';
        const url = this.doc.location.href;

        this.seo.update({ title, description, url });

        // Scroll to top bei Route-Change
        window.scrollTo(0, 0);
      });
  }

  onConfirmed(): void {
    this.confirmationService.handleConfirm();
  }

  onCancelled(): void {
    this.confirmationService.handleCancel();
  }

  // Listen to scroll events
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

    // Header scrolled state
    this.isScrolled = scrollPosition > 50;

    // Show scroll-to-top button
    this.showScrollTop = scrollPosition > 300;
  }

  // Scroll to top smoothly
  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  // Helper: Tiefste Route finden (für SEO)
  private getDeepest(route: ActivatedRoute): ActivatedRoute {
    let current = route;
    while (current.firstChild) current = current.firstChild;
    return current;
  }
}