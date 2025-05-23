import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardAnalyseComponent } from './dashboard-analyse/dashboard-analyse.component';

const routes: Routes = [
  { path: '', component: DashboardAnalyseComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnalyseRoutingModule { }
