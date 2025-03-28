import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminLayoutCustomComponent } from './admin-layout-custom/admin-layout-custom.component';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import { BlankLayoutComponent } from './blank-layout/blank-layout.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { SharedPipesModule } from '../../../shared/pipes/shared-pipes.module';
import { SearchModule } from '../search/search.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SidebarCompactComponent } from './admin-layout-custom/sidebar-compact/sidebar-compact.component';
import { HeaderSidebarCompactComponent } from './admin-layout-custom/header-sidebar-compact/header-sidebar-compact.component';
import { FooterComponent } from '../footer/footer.component';
import { CustomizerComponent } from '../customizer/customizer.component';
import { SharedDirectivesModule } from '../../../shared/directives/shared-directives.module';
import { FormsModule } from '@angular/forms';

const components = [
    HeaderSidebarCompactComponent,

    SidebarCompactComponent,
    FooterComponent,
    CustomizerComponent,

    AdminLayoutCustomComponent,
    AuthLayoutComponent,
    BlankLayoutComponent,
];

@NgModule({
  imports: [
    NgbModule,
    RouterModule,
    FormsModule,
    SearchModule,
    SharedPipesModule,
    SharedDirectivesModule,
    PerfectScrollbarModule,
    CommonModule
  ],
  declarations: components,
  exports: components
})
export class LayoutsModule { }
