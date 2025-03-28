import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FamilleService } from '../services/famille.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataLayerService } from 'src/app/shared/services/data-layer.service';

@Component({
  selector: 'app-list-familles',
  templateUrl: './list-familles.component.html',
  styleUrls: ['./list-familles.component.scss']
})
export class ListFamillesComponent implements OnInit {

  familles: any[] = []; // ✅ Store Familles

  constructor(
    private familleService: FamilleService,
    private router: Router,
    private modalService: NgbModal,
  
  ) {}

  ngOnInit(): void {
    console.log("🟢 ngOnInit exécuté !");

    this.loadFamilles();
    
  }


  editFamille(id: number | undefined) {
    if (id) {
      console.log('✏️ Edit Famille:', id);
      this.router.navigate(['service-competence/familles', id]);
    } else {
      console.error('❌ ID is undefined');
    }
  }
 
  createFamille() {
    this.router.navigate(['service-competence/familles/new']);
  }

  deleteFamille(id: number) {
    if (confirm('⚠️ Êtes-vous sûr de vouloir supprimer cette famille ?')) {
      this.familleService.deleteFamille(id).subscribe({
        next: () => {
          console.log(`🗑️ Famille ${id} supprimée`);
          this.familles = this.familles.filter(f => f.id !== id);
        },
        error: (err) => console.error('❌ Error deleting famille:', err)
      });
    }
  }


  loadFamilles() {
    console.log("📡 Chargement des familles...");
    this.familleService.getAllFamilles().subscribe({
      next: (data) => {
        
        this.familles = data;
      },
      error: (err) => console.error('❌ Erreur lors du chargement des familles:', err)
    });
  }

}
