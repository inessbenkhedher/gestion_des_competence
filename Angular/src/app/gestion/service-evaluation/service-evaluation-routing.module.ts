import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EvaluationsComponent } from './evaluations/evaluations.component';
import { MatriceComponent } from './matrice/matrice.component';
import { PostcompetenceComponent } from './postcompetence/postcompetence.component';
import { HistoriqueEvaluationComponent } from './historique-evaluation/historique-evaluation.component';

const routes: Routes = [
  { path: 'employee-details/:id', component:EvaluationsComponent },
  { path: 'matrice', component:MatriceComponent },
  { path: 'postCompetence', component:PostcompetenceComponent },
  { path: 'employee/:employeeId/competence/:competenceId/history', component: HistoriqueEvaluationComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServiceEvaluationRoutingModule { }
