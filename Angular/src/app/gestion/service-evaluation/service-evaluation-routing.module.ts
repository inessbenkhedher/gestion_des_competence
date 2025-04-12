import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EvaluationsComponent } from './evaluations/evaluations.component';
import { MatriceComponent } from './matrice/matrice.component';

const routes: Routes = [
  { path: 'employee-details/:id', component:EvaluationsComponent },
  { path: 'matrice', component:MatriceComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServiceEvaluationRoutingModule { }
