import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CompetanceService } from '../services/competance.service';

@Component({
  selector: 'app-competences',
  templateUrl: './competences.component.html',
  styleUrls: ['./competences.component.scss']
})
export class CompetencesComponent  implements OnInit {

  id: number | null = null;
  competenceForm!: FormGroup;
  indicateurs: any[] = [];
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private competenceService: CompetanceService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit() {
    // ✅ Step 1: Create Form First
    this.competenceForm = this.fb.group({
      code: ['', Validators.required],
      designation: ['', Validators.required],
      observation: [''],
      indicateurId: ['', Validators.required] // ✅ Hidden but required field
    });

    // ✅ Step 2: Get ID for Editing
    this.activatedRoute.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      this.id = idParam ? +idParam : null;
      this.isEditMode = !!this.id;

      if (this.isEditMode) {
        this.loadCompetence(this.id!);
      }
    });

    // ✅ Step 3: Auto-Assign `indicateurId` from Query Params
    this.activatedRoute.queryParamMap.subscribe((params) => {
      const indicateurId = params.get('indicateurId');
      if (indicateurId) {
        this.competenceForm.patchValue({ indicateurId: +indicateurId });
        console.log('✅ Indicateur ID automatically assigned:', indicateurId);
      }
    });
  }

  // ✅ Load the competence for editing
  loadCompetence(id: number) {
    this.competenceService.getCompetenceById(id).subscribe({
      next: (data) => {
        console.log('📥 Compétence chargée:', data);
        this.competenceForm.patchValue({
          code: data.code,
          designation: data.designation,
          observation: data.observatin,
          indicateurId: data.indicateur?.id
        });
      },
      error: (err) => console.error('❌ Erreur lors du chargement de la compétence:', err)
    });
  }

  // ✅ Handle form submission
  onSubmit() {
    if (this.competenceForm.invalid) return;

    const competenceData = {
      code: this.competenceForm.value.code,
      designation: this.competenceForm.value.designation,
      observatin: this.competenceForm.value.observation,
      indicateur: { id: this.competenceForm.value.indicateurId } // ✅ Indicateur is assigned
    };

    if (this.isEditMode) {
      this.competenceService.updateCompetence(this.id!, competenceData).subscribe({
        next: () => {
          console.log('✅ Compétence mise à jour avec succès !');
          this.router.navigate(['/service-competence/competences']);
        },
        error: (err) => console.error('❌ Erreur lors de la mise à jour de la compétence:', err)
      });
    } else {
      this.competenceService.addCompetence(competenceData).subscribe({
        next: () => {
          console.log('✅ Compétence ajoutée avec succès !');
          this.router.navigate(['/service-competence/competences']);
        },
        error: (err) => console.error('❌ Erreur lors de l\'ajout de la compétence:', err)
      });
    }
  }
}