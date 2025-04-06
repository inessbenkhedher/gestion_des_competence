import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FamilleComponent } from './famille/famille.component';
import { CategorieComponent } from './categorie/categorie.component';
import { CompetencesComponent } from './competences/competences.component';
import { ListIndicateursComponent } from './list-indicateurs/list-indicateurs.component';
import { ListFamillesComponent } from './list-familles/list-familles.component';
import { ListCompetancesComponent } from './list-competances/list-competances.component';


const routes: Routes = [
  { path: 'familles/new', component: FamilleComponent },
  { path: 'familles', component: ListFamillesComponent },
  { path: 'familles/:id', component: FamilleComponent  },
  { path: 'categories/new', component: CategorieComponent }, // ➕ Création
  { path: 'categories/:id', component: CategorieComponent } ,
  { path: 'competences', component: ListCompetancesComponent },
  { path: 'competences/new', component: CompetencesComponent },
  { path: 'competences/:id', component: CompetencesComponent },
  {
    path: 'indicateurs',component: ListIndicateursComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServiceCompetenceRoutingModule { }
