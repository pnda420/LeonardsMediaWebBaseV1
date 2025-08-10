import { Component } from '@angular/core';
import { PageTitleComponent } from "../../shared/page-title/page-title.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [PageTitleComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
