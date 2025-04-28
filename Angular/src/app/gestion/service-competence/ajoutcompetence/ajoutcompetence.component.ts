import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CompetanceService } from '../services/competance.service';

@Component({
  selector: 'app-ajoutcompetence',
  templateUrl: './ajoutcompetence.component.html',
  styleUrls: ['./ajoutcompetence.component.scss']
})
export class AjoutcompetenceComponent implements OnInit {

  form: FormGroup;
  indicateurId: string;

  constructor(private fb: FormBuilder,private route: ActivatedRoute, private competenceService: CompetanceService
    ,  private router: Router

  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      competences: this.fb.array([ this.createCompetence() ])
    });
    this.route.queryParams.subscribe(params => {
      this.indicateurId = params['indicateurId'];
    });
  }

  // Créer un groupe vide pour une compétence
  createCompetence(): FormGroup {
    return this.fb.group({
      code: ['', Validators.required],
      designation: ['', Validators.required],
      observatin: ['', Validators.required]
    });
  }

  // Récupérer facilement le tableau de compétences
  competences(): FormArray {
    return this.form.get('competences') as FormArray;
  }

  // Ajouter une nouvelle compétence vide
  addCompetence() {
    this.competences().push(this.createCompetence());
  }

  // Soumettre tout le formulaire
  onSubmit() {
    if (this.form.valid) {
      const competences = this.form.value.competences;
      this.competenceService.bulkAddCompetences(this.indicateurId, competences)
        .subscribe({
          next: (response) => {
            console.log('Compétences ajoutées avec succès', response);
            // Tu peux ajouter une alerte ou rediriger ici
            this.router.navigate(['/service-competence/indicateurs']);
          },
          error: (error) => {
            console.error('Erreur lors de l\'ajout des compétences', error);
          }
        });
    }
  }
}