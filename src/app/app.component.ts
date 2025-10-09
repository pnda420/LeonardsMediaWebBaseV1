import { Component, Inject, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, CommonModule, FormsModule, MaintenanceComponent, ToastContainerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'WebsiteBaseV2';
  isUnderConstruction = false;
  private readonly accessPassword = 'lm';

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private seo: SeoService,
    @Inject(DOCUMENT) private doc: Document,
    private toasts: ToastService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const access = params['pw'];
      if (access === this.accessPassword) {
        this.isUnderConstruction = false;
        this.router.navigate([], { queryParams: { pw: null }, queryParamsHandling: 'merge' });
        // optional: Flag im localStorage merken (damit nicht jedes Mal in URL nötig)
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
      });
  }

  private getDeepest(route: ActivatedRoute): ActivatedRoute {
    let current = route;
    while (current.firstChild) current = current.firstChild;
    return current;
  }
}
