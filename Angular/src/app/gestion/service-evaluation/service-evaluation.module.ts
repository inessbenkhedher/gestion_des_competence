import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServiceEvaluationRoutingModule } from './service-evaluation-routing.module';
import { EvaluationsComponent } from './evaluations/evaluations.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatriceComponent } from './matrice/matrice.component';
import { PostcompetenceComponent } from './postcompetence/postcompetence.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { HistoriqueEvaluationComponent } from './historique-evaluation/historique-evaluation.component';


@NgModule({
  declarations: [
    EvaluationsComponent,
    MatriceComponent,
    PostcompetenceComponent,
    HistoriqueEvaluationComponent
  ],
  imports: [
    CommonModule,
    ServiceEvaluationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
  ]
})
export class ServiceEvaluationModule { }
