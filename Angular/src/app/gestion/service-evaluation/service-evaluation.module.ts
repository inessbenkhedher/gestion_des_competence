import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServiceEvaluationRoutingModule } from './service-evaluation-routing.module';
import { EvaluationsComponent } from './evaluations/evaluations.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatriceComponent } from './matrice/matrice.component';


@NgModule({
  declarations: [
    EvaluationsComponent,
    MatriceComponent
  ],
  imports: [
    CommonModule,
    ServiceEvaluationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class ServiceEvaluationModule { }
