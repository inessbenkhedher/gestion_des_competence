import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnalyseRoutingModule } from './analyse-routing.module';
import { DashboardAnalyseComponent } from './dashboard-analyse/dashboard-analyse.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxEchartsModule } from 'ngx-echarts';
import { SaisieElementComponent } from './saisie-element/saisie-element.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';


@NgModule({
  declarations: [
    DashboardAnalyseComponent,
    SaisieElementComponent
  ],
  imports: [
    CommonModule,
    AnalyseRoutingModule,
    ReactiveFormsModule,
    NgxEchartsModule,
     NgxDatatableModule,
  ]
})
export class AnalyseModule { }
