// Angular Imports
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardComponent } from './components/card/card.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';

import { SpinnerComponent } from './components/spinner/spinner.component';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { ConfigurationComponent } from './components/configuration/configuration.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { NavLeftComponent } from './components/nav-bar/nav-left/nav-left.component';
import { NavLogoComponent } from './components/nav-bar/nav-logo/nav-logo.component';
import { NavRightComponent } from './components/nav-bar/nav-right/nav-right.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { NavContentComponent } from './components/navigation/nav-content/nav-content.component';
import { NavCollapseComponent } from './components/navigation/nav-content/nav-collapse/nav-collapse.component';
import { NavGroupComponent } from './components/navigation/nav-content/nav-group/nav-group.component';
import { NavItemComponent } from './components/navigation/nav-content/nav-item/nav-item.component';

// bootstrap import
import { NgbDropdownModule, NgbNavModule, NgbModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { HomepageHeaderComponent } from './components/homepage-header/homepage-header.component';
import { HomepageFooterComponent } from './components/homepage-footer/homepage-footer.component';
import { HomepageHeaderNavBarComponent } from './components/homepage-header-nav-bar/homepage-header-nav-bar.component';
import { MaterialModule } from 'src/app/material/material.module';
import { CustomLabelDirective } from './directives/custom-label.directive';

@NgModule({
  declarations: [
    BreadcrumbComponent,
    CardComponent,
    ConfigurationComponent,
    CustomLabelDirective,
    HomepageFooterComponent,
    HomepageHeaderComponent,
    HomepageHeaderNavBarComponent,
    NavBarComponent,
    NavCollapseComponent,
    NavContentComponent,
    NavGroupComponent,
    NavigationComponent,
    NavItemComponent,
    NavLeftComponent,
    NavLogoComponent,
    NavRightComponent,
    SpinnerComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    NgbCollapseModule,
    NgbDropdownModule,
    NgbModule,
    NgbNavModule,
    NgScrollbarModule,
    ReactiveFormsModule,
    RouterModule,

  ],
  exports: [
    BreadcrumbComponent,
    CardComponent,
    CommonModule,
    ConfigurationComponent,
    CustomLabelDirective,
    FormsModule,
    HomepageFooterComponent,
    HomepageHeaderComponent,
    HomepageHeaderNavBarComponent,
    MaterialModule,
    NavBarComponent,
    NavCollapseComponent,
    NavContentComponent,
    NavGroupComponent,
    NavigationComponent,
    NavItemComponent,
    NavLeftComponent,
    NavLogoComponent,
    NavRightComponent,
    NgbCollapseModule,
    NgbDropdownModule,
    NgbModule,
    NgbNavModule,
    NgScrollbarModule,
    ReactiveFormsModule,
    SpinnerComponent,
  ],
})
export class SharedModule {}
