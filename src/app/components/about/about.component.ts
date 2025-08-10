import { Component } from '@angular/core';
import { PageTitleComponent } from "../../shared/page-title/page-title.component";

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [PageTitleComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {

}
