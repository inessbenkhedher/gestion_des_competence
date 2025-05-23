import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ListIndicateursComponent } from './list-indicateurs/list-indicateurs.component';
import { ListFamillesComponent } from './list-familles/list-familles.component';
import { ListCompetancesComponent } from './list-competances/list-competances.component';
import { AjoutcompetenceComponent } from './ajoutcompetence/ajoutcompetence.component';


const routes: Routes = [

  { path: 'familles', component: ListFamillesComponent },
 
  
  { path: 'competences', component: ListCompetancesComponent },
  { path: 'competence/new', component: AjoutcompetenceComponent },

  {
    path: 'indicateurs',component: ListIndicateursComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServiceCompetenceRoutingModule { }
