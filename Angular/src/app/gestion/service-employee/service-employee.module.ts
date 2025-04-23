import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServiceEmployeeRoutingModule } from './service-employee-routing.module';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ReactiveFormsModule } from '@angular/forms';
import { FormWizardModule } from "../../shared/components/form-wizard/form-wizard.module";
import { EvaluerempComponent } from './evalueremp/evalueremp.component';


@NgModule({
  declarations: [
    EmployeeListComponent,
    EvaluerempComponent
  ],
  imports: [
    CommonModule,
    NgxDatatableModule,
    ReactiveFormsModule,
    ServiceEmployeeRoutingModule,
    FormWizardModule
]
})
export class ServiceEmployeeModule { }
