import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PostcomptenceService } from '../services/postcomptence.service';
import { ToastrService } from 'ngx-toastr';
import { EvaluationService } from '../../service-employee/services/evaluation.service';

@Component({
  selector: 'app-postcompetence',
  templateUrl: './postcompetence.component.html',
  styleUrls: ['./postcompetence.component.scss']
})
export class PostcompetenceComponent implements OnInit {
  postCompetences: any[] = [];
  selected: any[] = [];

  currentStep = 1;
  familles: any[] = [];
  indicateurs: any[] = [];
  competences: any[] = [];
  postes: any[] = [];
  niveaux: string[] = [];

  step1Form!: FormGroup;
  step2Form!: FormGroup;

  isEditMode = false;
  currentId: number | null = null;

  editNiveauForm: FormGroup;

  constructor(
    private posteCompetenceService: PostcomptenceService,
    private evaluationService: EvaluationService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) { this.editNiveauForm = this.fb.group({
    niveauRequis: ['', [Validators.required]]  // Assure-toi que niveauRequis est bien initialisé
  });}

  ngOnInit(): void {
    this.loadPosteCompetences();
    this.loadFamilles();
    this.loadPostes();
    this.posteCompetenceService.getNiveaux().subscribe((data: string[]) => {
      this.niveaux = data;
    });
  }

  initForms(posteCompetence?: any) {
    this.step1Form = this.fb.group({
      famille: [posteCompetence?.familleId || '', Validators.required],
      indicateur: [posteCompetence?.indicateurId || '', Validators.required],
      competence: [posteCompetence?.competenceId || '', Validators.required]
    });

    this.step2Form = this.fb.group({
      poste: [posteCompetence?.posteId || '', Validators.required],
      niveauRequis: [posteCompetence?.niveauRequis || '', [Validators.required, Validators.min(1)]]
    });
  }

  loadPosteCompetences() {
    this.posteCompetenceService.getAll().subscribe({
      next: (data) => this.postCompetences = data,
      error: (err) => console.error('❌ Erreur lors de la récupération des données:', err)
    });
  }

  loadFamilles() {
    this.evaluationService.getAllFamilles().subscribe(data => this.familles = data);
  }

  loadPostes() {
    this.posteCompetenceService.getAllPostes().subscribe(data => this.postes = data);
  }

  onFamilleSelect(familleId: number) {
    this.indicateurs = [];
    this.competences = [];
    this.step1Form.patchValue({ indicateur: '', competence: '' });

    this.evaluationService.getIndicateursByFamille(familleId).subscribe(
      data => this.indicateurs = data,
      error => console.error("Erreur chargement indicateurs", error)
    );
  }

  onIndicateurSelect(indicateurId: number) {
    this.competences = [];
    this.step1Form.patchValue({ competence: '' });

    this.evaluationService.getCompetencesByIndicateur(indicateurId).subscribe(
      data => this.competences = data,
      error => console.error("Erreur chargement compétences", error)
    );
  }

  goToStep(step: number) {
    if (step === 2 && this.step1Form.valid) {
      this.currentStep = 2;
    } else if (step === 1) {
      this.currentStep = 1;
    }
  }

  openFormModal(content: any) {
    if (this.isEditMode) {
      if (this.selected.length !== 1) {
        this.warningBar("Veuillez sélectionner un poste à modifier.");
        return;
      }
  
      const selectedItem = this.selected[0];
      console.log("🟡 Selected item:", selectedItem);
      
      this.currentId = selectedItem.id || selectedItem.posteCompetenceId;
      
      this.step2Form = this.fb.group({
        poste: [
          selectedItem.poste?.id || selectedItem.posteId || '', 
          Validators.required
        ],
        niveauRequis: [
          selectedItem.niveauRequis || '', 
          [Validators.required, Validators.min(1)]
        ]
      });
  
      this.currentStep = 2; // aller directement à l'étape 2
    } else {
      // Mode ajout : initier tout depuis le début
      this.initForms(null);
      this.currentStep = 1;
    }
  
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  submitForm(modal: any) {
    // Vérifie que les formulaires sont bien initialisés
    if (!this.step1Form || !this.step2Form || this.step1Form.invalid || this.step2Form.invalid) {
      this.toastr.warning("Veuillez remplir tous les champs.");
      return;
    }
  
    const payload = {
      competenceId: this.step1Form.value.competence,
      posteId: this.step2Form.value.poste,
      niveauRequis: this.step2Form.value.niveauRequis
    };
  
    const request = this.isEditMode && this.currentId
      ? this.posteCompetenceService.update(this.currentId, payload)
      : this.posteCompetenceService.add(payload);
  
    request.subscribe({
      next: () => {
        this.loadPosteCompetences();
        modal.close();
        const message = this.isEditMode ? "Modifié avec succès !" : "Ajouté avec succès !";
        this.toastr.success(message);
      },
      error: () => this.toastr.error("Une erreur est survenue.")
    });
  }

  handleDelete(modal: any) {
    if (this.selected.length !== 1) {
      this.toastr.warning("Veuillez sélectionner un seul poste à supprimer.");
      return;
    }

    const selectedId = this.selected[0]?.id;
    if (selectedId) {
      this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title' });
    }
  }

  confirmDelete(modal: any) {
    const selectedId = this.selected[0]?.id;
    if (selectedId) {
      this.posteCompetenceService.delete(selectedId).subscribe(() => {
        this.loadPosteCompetences();
        this.toastr.success("Poste supprimé !");
        modal.close();
        this.selected = [];
      });
    }
  }

  toggleSelection(row: any) {
    if (this.selected.length === 1 && this.selected[0].id === row.id) {
      this.selected = [];
    } else {
      this.selected = [row];
    }
  }

  warningBar(msg: string) {
    this.toastr.warning(msg, 'Attention', { timeOut: 2000, closeButton: true, progressBar: true });
  }


  openEditNiveauModal(content: any) {
    if (this.selected.length !== 1) {
      this.warningBar("Veuillez sélectionner un seul élément à modifier.");
      return;
    }

    const selected = this.selected[0];
    this.currentId = selected.id || selected.posteCompetenceId;

    // Initialisation du formulaire avec la valeur actuelle
    this.editNiveauForm.setValue({
      niveauRequis: selected.niveauRequis || ''
    });

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  submitNiveauUpdate(modal: any) {
    const niveau = this.editNiveauForm.value.niveauRequis;
  
    const payload = {
      niveauRequis: niveau,
      posteId: this.selected[0].poste?.id || this.selected[0].posteId,
      competenceId: this.selected[0].competence?.id || this.selected[0].competenceId
    };

    this.posteCompetenceService.update(this.currentId!, payload).subscribe({
      next: () => {
        this.loadPosteCompetences();
        this.toastr.success("Niveau modifié avec succès !");
        modal.close();
      },
      error: () => this.toastr.error("Erreur lors de la modification.")
    });
  }
  
}