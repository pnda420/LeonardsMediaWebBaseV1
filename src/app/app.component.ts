import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./shared/header/header.component";
import { FooterComponent } from "./shared/footer/footer.component";
import { SeoService } from './shared/seo.service';
import { CommonModule, DOCUMENT } from '@angular/common';
import { filter } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'WebsiteBaseV2';

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private seo: SeoService,
    @Inject(DOCUMENT) private doc: Document
  ) {}

  ngOnInit(): void {
    // Update SEO on each successful navigation
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => {
        const deepest = this.getDeepest(this.route);
        const routeTitle: any = deepest.snapshot.routeConfig && (deepest.snapshot.routeConfig as any).title;
        const description = deepest.snapshot.data && deepest.snapshot.data['description'];
        const title = typeof routeTitle === 'string' ? routeTitle : 'Leonards Media';
        const url = this.doc.location.href;

        this.seo.update({
          title,
          description,
          url,
        });
      });
  }



  private getDeepest(route: ActivatedRoute): ActivatedRoute {
    let current = route;
    while (current.firstChild) {
      current = current.firstChild;
    }
    return current;
  }

  checkIfOnRoute(route: string){
    


  }
}
