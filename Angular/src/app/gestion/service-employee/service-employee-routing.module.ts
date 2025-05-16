import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { EvaluerempComponent } from './evalueremp/evalueremp.component';
import { EmployeeDashboardComponent } from './employee-dashboard/employee-dashboard.component';

const routes: Routes = [
  { path: 'employees', component: EmployeeListComponent },
  { path: 'evaluation', component: EvaluerempComponent },
  { path: 'dashboardemploye/:id', component: EmployeeDashboardComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServiceEmployeeRoutingModule { }
