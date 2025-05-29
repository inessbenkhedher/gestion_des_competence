import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardAnalyseComponent } from './dashboard-analyse/dashboard-analyse.component';
import { SaisieElementComponent } from './saisie-element/saisie-element.component';

const routes: Routes = [
  { path: 'charts', component: DashboardAnalyseComponent },
   { path: 'saisie', component: SaisieElementComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnalyseRoutingModule { }
