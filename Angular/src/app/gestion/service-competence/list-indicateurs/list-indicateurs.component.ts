import { Component, OnInit } from '@angular/core';
import { IndicateurService } from '../services/indicateur.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-indicateurs',
  templateUrl: './list-indicateurs.component.html',
  styleUrls: ['./list-indicateurs.component.scss']
})
export class ListIndicateursComponent implements OnInit {
 
  indicateurs: any[] = []; // ✅ Store Indicateurs

  constructor(private indicateurService: IndicateurService
    , private router:Router
  ) {}

  ngOnInit() {
    this.loadIndicateurs();
  }

  loadIndicateurs() {
    this.indicateurService.getAllIndicateurs().subscribe({
      next: (data) => {
        console.log('✅ Indicateurs API Response:', data);
        this.indicateurs = data;
      },
      error: (err) => console.error('❌ Error fetching indicateurs:', err)
    });
  }

  goToAdd() {
    this.router.navigate(['service-competence/categories/new']); 
    // Adaptez le chemin selon votre routing
}


  editIndicateur(id: number | undefined) {
    if (id) {
      console.log('✏️ Edit Indicateur:', id);
      this.router.navigate(['service-competence/categories', id]); // ✅ Redirige vers la page de modification
    } else {
      console.error('❌ ID is undefined');
    }
  }
  createIndicateur() {
    this.router.navigate(['service-competence/categories/new']); // ✅ Redirige vers la page de création
  }

  showCompetences(id: number) {
    console.log('🔍 Show Competences for Indicateur:', id);
    // TODO: Navigate to Competence Page
  }
}
