import { Component, Input } from '@angular/core';

@Component({
  selector: 'homepage-header-nav-bar',
  templateUrl: './homepage-header-nav-bar.component.html',
  styleUrl: './homepage-header-nav-bar.component.scss'
})
export class HomepageHeaderNavBarComponent {
  @Input() extraClasses: string = '';
  @Input() showLoginLink: boolean = true;
}
