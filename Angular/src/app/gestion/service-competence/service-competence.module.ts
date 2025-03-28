import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ServiceCompetenceRoutingModule } from './service-competence-routing.module';
import { CategorieComponent } from './categorie/categorie.component';
import { FamilleComponent } from './famille/famille.component';
import { ListIndicateursComponent } from './list-indicateurs/list-indicateurs.component';
import { ListFamillesComponent } from './list-familles/list-familles.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ListCompetancesComponent } from './list-competances/list-competances.component';


@NgModule({
  declarations: [
    CategorieComponent,
    FamilleComponent,
    ListIndicateursComponent,
    ListFamillesComponent,
    ListCompetancesComponent
  ],
  imports: [
    CommonModule,
    ServiceCompetenceRoutingModule,
    NgxDatatableModule,
    ReactiveFormsModule
  ]
})
export class ServiceCompetenceModule { }
