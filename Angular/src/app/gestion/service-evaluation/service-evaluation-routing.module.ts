import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EvaluationsComponent } from './evaluations/evaluations.component';

const routes: Routes = [
  { path: 'employee-details/:id', component:EvaluationsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServiceEvaluationRoutingModule { }
