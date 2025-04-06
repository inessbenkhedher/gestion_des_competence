import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FamilleService } from '../services/famille.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DataLayerService } from 'src/app/shared/services/data-layer.service';

@Component({
  selector: 'app-list-familles',
  templateUrl: './list-familles.component.html',
  styleUrls: ['./list-familles.component.scss']
})
export class ListFamillesComponent implements OnInit {

  familles: any[] = []; // ✅ Store Familles
  deleteFamilleId: number | null = null;

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

  
  openDeleteModal(id: number, modalContent: any) {
    this.deleteFamilleId = id;
    this.modalService.open(modalContent, { ariaLabelledBy: 'modal-basic-title', centered: true });
  }

  confirmDelete(modal: NgbModalRef) {
    if (this.deleteFamilleId !== null) {
      this.familleService.deleteFamille(this.deleteFamilleId).subscribe({
        next: () => {
          console.log(`🗑️ Famille ${this.deleteFamilleId} supprimée`);
          this.familles = this.familles.filter(f => f.id !== this.deleteFamilleId);
          modal.close('deleted');
          this.deleteFamilleId = null;
        },
        error: (err) => {
          console.error('❌ Error deleting famille:', err);
          modal.dismiss('error');
        }
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
