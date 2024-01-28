import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './layouts/admin-layout.component';
import { DefaultComponent } from 'src/app/demo/default/default.component';
import { TypographyComponent } from 'src/app/demo/elements/typography/typography.component';
import { ElementColorComponent } from 'src/app/demo/elements/element-color/element-color.component';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: 'default', component: DefaultComponent} ,
      { path: 'typography', component: TypographyComponent },
      { path: 'color', component: ElementColorComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
