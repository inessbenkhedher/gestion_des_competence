import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ServiceCompetenceRoutingModule } from './service-competence-routing.module';

import { ListIndicateursComponent } from './list-indicateurs/list-indicateurs.component';
import { ListFamillesComponent } from './list-familles/list-familles.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ListCompetancesComponent } from './list-competances/list-competances.component';
import { AjoutcompetenceComponent } from './ajoutcompetence/ajoutcompetence.component';


@NgModule({
  declarations: [
    
    ListIndicateursComponent,
    ListFamillesComponent,
    ListCompetancesComponent,
    AjoutcompetenceComponent
  ],
  imports: [
    CommonModule,
    ServiceCompetenceRoutingModule,
    NgxDatatableModule,
    ReactiveFormsModule
  ]
})
export class ServiceCompetenceModule { }
