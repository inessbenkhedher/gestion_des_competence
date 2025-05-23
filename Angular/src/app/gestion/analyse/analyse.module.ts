import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnalyseRoutingModule } from './analyse-routing.module';
import { DashboardAnalyseComponent } from './dashboard-analyse/dashboard-analyse.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxEchartsModule } from 'ngx-echarts';


@NgModule({
  declarations: [
    DashboardAnalyseComponent
  ],
  imports: [
    CommonModule,
    AnalyseRoutingModule,
    ReactiveFormsModule,
    NgxEchartsModule
  ]
})
export class AnalyseModule { }
