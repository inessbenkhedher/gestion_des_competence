import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServiceEvaluationRoutingModule } from './service-evaluation-routing.module';
import { EvaluationsComponent } from './evaluations/evaluations.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    EvaluationsComponent
  ],
  imports: [
    CommonModule,
    ServiceEvaluationRoutingModule,
    FormsModule
  ]
})
export class ServiceEvaluationModule { }
