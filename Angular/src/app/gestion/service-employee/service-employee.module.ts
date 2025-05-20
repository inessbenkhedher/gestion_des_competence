import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServiceEmployeeRoutingModule } from './service-employee-routing.module';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ReactiveFormsModule } from '@angular/forms';
import { FormWizardModule } from "../../shared/components/form-wizard/form-wizard.module";
import { EvaluerempComponent } from './evalueremp/evalueremp.component';
import { EmployeeDashboardComponent } from './employee-dashboard/employee-dashboard.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { DashboardComponent } from './dashboard/dashboard.component';


@NgModule({
  declarations: [
    EmployeeListComponent,
    EvaluerempComponent,
    EmployeeDashboardComponent,
    DashboardComponent
  ],
  imports: [
    CommonModule,
    NgxDatatableModule,
    ReactiveFormsModule,
    ServiceEmployeeRoutingModule,
    FormWizardModule,
    NgxEchartsModule
]
})
export class ServiceEmployeeModule { }
