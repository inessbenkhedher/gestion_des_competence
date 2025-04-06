import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CompetanceService } from '../services/competance.service';

@Component({
  selector: 'app-list-competances',
  templateUrl: './list-competances.component.html',
  styleUrls: ['./list-competances.component.scss']
})
export class ListCompetancesComponent implements OnInit {

  competences: any[] = [];
  deleteCompetenceId: number | null = null;

  constructor(
    private competenceService: CompetanceService,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    console.log("📡 Chargement des compétences...");
    this.loadCompetences();
  }

  createCompetence() {
    this.router.navigate(['service-competence/competences/new']);
  }

  editCompetence(id: number) {
    this.router.navigate(['service-competence/competences', id]);
  }

  openDeleteModal(id: number, modalContent: any) {
    console.log('Opening delete modal for ID:', id); // Debug log
    this.deleteCompetenceId = id;
    console.log('Current deleteCompetenceId:', this.deleteCompetenceId); // Debug log
    this.modalService.open(modalContent, { 
        ariaLabelledBy: 'modal-basic-title', 
        centered: true 
    });
}

  confirmDelete(modal: NgbModalRef) {
    if (this.deleteCompetenceId) { // Changed to check truthy value
      this.competenceService.deleteCompetence(this.deleteCompetenceId).subscribe({
        next: () => {
          console.log(`🗑️ Compétence ${this.deleteCompetenceId} supprimée`);
          this.competences = this.competences.filter(f => f.id !== this.deleteCompetenceId);
          modal.close('deleted');
          this.deleteCompetenceId = null;
        },
        error: (err) => {
          console.error('❌ Error deleting Competence:', err);
          modal.dismiss('error');
        },
        complete: () => {
          this.deleteCompetenceId = null; // Ensure reset after complete
        }
      });
    } else {
      console.error('❌ ID de compétence non défini');
      modal.dismiss('invalid id');
    }
}


  loadCompetences() {
    this.competenceService.getAllCompetences().subscribe({
      next: (data) => {
        this.competences = data;
      },
      error: (err) => console.error('❌ Erreur lors du chargement des compétences:', err)
    });
  }

  exportCompetences() {
    this.competenceService.exportCompetences().subscribe({
      next: (response) => {
        const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'Competences.xlsx'; // File name
        link.click();
        console.log('✅ Export success!');
      },
      error: (err) => console.error('❌ Export failed:', err)
    });
  }
}
