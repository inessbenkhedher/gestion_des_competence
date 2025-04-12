import { Component, OnInit } from '@angular/core';
import { IndicateurService } from '../services/indicateur.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompetanceService } from '../services/competance.service';

@Component({
  selector: 'app-list-indicateurs',
  templateUrl: './list-indicateurs.component.html',
  styleUrls: ['./list-indicateurs.component.scss']
})
export class ListIndicateursComponent implements OnInit {
 
  indicateurs: any[] = []; // ✅ Store Indicateurs
  selected: any[] = [];
  currentIndicateurId: number | null = null;
  familles: any[] = [];
  isEditMode = false;
  indicateurForm!: FormGroup;
  competenceForm!: FormGroup;
  deleteIndicateureId: number | null = null;


  constructor(private indicateurService: IndicateurService, private competenceservice :CompetanceService
    , private router:Router,private toastr: ToastrService, private modalService: NgbModal, 
    private fb: FormBuilder,
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


 
openIndicateurModal(content: any, editData?: any) {
  this.isEditMode = !!editData;
  this.currentIndicateurId = editData?.id || null;

  this.indicateurForm = this.fb.group({
    title: [editData?.title || '', Validators.required],
    description: [editData?.description || ''],
    familleId: [editData?.famille?.id || '', Validators.required]
  });

  this.indicateurService.getFamilles().subscribe(data => this.familles = data);

  this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
}

onSubmit(modal: any) {
  if (this.indicateurForm.invalid) return;

  const formValue = this.indicateurForm.value;
  const payload = {
    title: formValue.title,
    description: formValue.description,
    famille: { id: formValue.familleId }
  };

  if (this.isEditMode && this.currentIndicateurId) {
    this.indicateurService.updateIndicateur(this.currentIndicateurId, payload).subscribe(() => {
      this.loadIndicateurs();
      modal.close();
      this.toastr.success("Indicateur modifié !");
    });
  } else {
    this.indicateurService.addIndicateur(payload).subscribe(() => {
      this.loadIndicateurs();
      modal.close();
      this.toastr.success("Indicateur ajouté !");
    });
  }
}


  
  warningBar(msg: string) {
    this.toastr.warning(msg, 'Attention', {
      timeOut: 2000,
      closeButton: true,
      progressBar: true,
      
    });
  }



  // ✅ Safe edit handler
 toggleSelection(row: any) {
  if (this.selected.length === 1 && this.selected[0].id === row.id) {
    this.selected = [];
  } else {
    this.selected = [row];
  }
}




onEditClicked(modalTemplate: any) {
  if (this.selected.length === 1 && this.selected[0]?.id) {
    const selectedIndicateur = this.selected[0];

    this.openIndicateurModal(modalTemplate, selectedIndicateur);
  } else {
    this.warningBar('Veuillez sélectionner un seul indicateur à modifier.');
  }
}






onAddCompetenceClicked(modalTemplate: any) {
  if (this.selected.length !== 1) {
    this.warningBar('Veuillez sélectionner un seul indicateur pour ajouter une compétence.');
    return;
  }

  const selectedIndicateur = this.selected[0];

  this.competenceForm = this.fb.group({
    code: ['', Validators.required],
    designation: ['', Validators.required],
    observation: [''],
    indicateurId: [selectedIndicateur.id, Validators.required]
  });

  this.modalService.open(modalTemplate, { ariaLabelledBy: 'modal-basic-title' });
}

submitCompetence(modal: any) {
  if (this.competenceForm.invalid) return;

  const formData = this.competenceForm.value;

  const payload = {
    code: formData.code,
    designation: formData.designation,
    observatin: formData.observation,
    indicateur: { id: formData.indicateurId }
  };

  this.competenceservice.addCompetence(payload).subscribe({
    next: () => {
      this.toastr.success('Compétence ajoutée avec succès !');
      modal.close();
      // Optionally reload or refresh data if needed
    },
    error: () => {
      this.toastr.error('Erreur lors de l\'ajout de la compétence.');
    }
  });
}

handleDelete(modalContent: any) {
  if (this.selected.length !== 1) {
    this.warningBar("Veuillez sélectionner un seul indicateur à supprimer.");
    return;
  }

  const selectedId = this.selected[0]?.id;
  if (selectedId) {
    this.openDeleteModal(selectedId, modalContent);
  }
}

openDeleteModal(id: number, modalContent: any) {
    this.deleteIndicateureId = id;
    this.modalService.open(modalContent, { ariaLabelledBy: 'modal-basic-title', centered: true });
  }

  confirmDelete(modal: NgbModalRef) {
    if (this.deleteIndicateureId !== null) {
      this.indicateurService.deleteIndicateur(this.deleteIndicateureId).subscribe({
        next: () => {
          this.indicateurs = this.indicateurs.filter(i => i.id !== this.deleteIndicateureId);
          this.toastr.success("Indicateur supprimé !");
          this.deleteIndicateureId = null;
          this.selected = [];
          modal.close();
        },
        error: (err) => {
          console.error('❌ Erreur lors de la suppression :', err);
          this.toastr.error("Erreur lors de la suppression de l'indicateur.");
          modal.dismiss();
        }
      });
    }
  }


}
