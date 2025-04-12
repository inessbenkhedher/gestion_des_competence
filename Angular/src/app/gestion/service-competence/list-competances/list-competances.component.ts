import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CompetanceService } from '../services/competance.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-list-competances',
  templateUrl: './list-competances.component.html',
  styleUrls: ['./list-competances.component.scss']
})
export class ListCompetancesComponent implements OnInit {

  competences: any[] = [];
  deleteCompetenceId: number | null = null;
  selected: any[] = [];
  competenceForm!: FormGroup;
isEditCompetence = false;


  constructor(
    private competenceService: CompetanceService,
    private router: Router,
    private modalService: NgbModal,private toastr: ToastrService,private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    console.log("📡 Chargement des compétences...");
    this.loadCompetences();
    this.initForm();
  }

  initForm() {
    this.competenceForm = this.fb.group({
      code: [''],
      designation: [''],
      observation: ['']
    });
  }


  toggleSelection(row: any) {
    if (this.selected.length === 1 && this.selected[0].id === row.id) {
      this.selected = [];
    } else {
      this.selected = [row];
    }
  }


  editCompetence(modalContent: any) {
    if (this.selected.length === 1) {
      const selectedCompetence = this.selected[0];
      this.isEditCompetence = true;
  
      // Remplir le formulaire avec les données sélectionnées
      this.competenceForm.patchValue({
        code: selectedCompetence.code,
        designation: selectedCompetence.designation,
        observation: selectedCompetence.observatin,
      });
  
      // Ouvrir la modale avec les données
      this.modalService.open(modalContent, {
        ariaLabelledBy: 'modal-basic-title',
        centered: true,
      });
    } else  {
      this.warningBar("Veuillez sélectionner une compétence à modifier.");
    } 
  }
  

  submitCompetence(modal: NgbModalRef) {
    if (this.competenceForm.invalid || this.selected.length !== 1) return;
  
    const formValue = this.competenceForm.value;
    const id = this.selected[0].id;
  
    const data = {
      code: formValue.code,
      designation: formValue.designation,
      observatin: formValue.observation,
      
    };
  
    this.competenceService.updateCompetence(id, data).subscribe({
      next: () => {
        this.toastr.success("Compétence modifiée avec succès");
        this.loadCompetences();
        modal.close();
        this.selected = [];
      },
      error: (err) => this.toastr.error("Erreur de modification"),
    });
  
    this.competenceForm.reset();
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

onDeleteClick(modalContent: any) {
  if (this.selected.length === 1) {
    const selectedId = this.selected[0]?.id;
    this.openDeleteModal(selectedId, modalContent);
  } else if (this.selected.length === 0) {
    this.warningBar("Veuillez sélectionner une compétence à supprimer.");
  } else {
    this.warningBar("Veuillez sélectionner une seule compétence à la fois.");
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




    
  warningBar(msg: string) {
    this.toastr.warning(msg, 'Attention', {
      timeOut: 2000,
      closeButton: true,
      progressBar: true
    });
  }

}
