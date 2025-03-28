import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IndicateurService } from '../services/indicateur.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-categorie',
  templateUrl: './categorie.component.html',
  styleUrls: ['./categorie.component.scss']
})
export class CategorieComponent implements OnInit {

  id: number | null = null;
  indicateurForm!: FormGroup;
  familles: any[] = []; 
  isEditMode = false; // ✅ Détecter le mode

  constructor(
    private fb: FormBuilder,
    private indicateurService: IndicateurService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    // ✅ Vérifier si un ID est présent dans l'URL
    this.activatedRoute.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      this.id = idParam ? +idParam : null;
      this.isEditMode = !!this.id;

      if (this.isEditMode) {
        this.loadIndicateur(this.id!);
      }
    });

    // ✅ Créer le formulaire
    this.indicateurForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      familleId: ['', Validators.required]
    });

    // ✅ Récupérer les familles
    this.indicateurService.getFamilles().subscribe({
      next: (data) => {
        this.familles = data;
      },
      error: (err) => console.error('❌ Error fetching familles:', err)
    });
  }

  // ✅ Charger les données lors de l'édition
  loadIndicateur(id: number) {
    this.indicateurService.getIndicateurById(id).subscribe({
      next: (data) => {
        console.log('📥 Loaded Indicateur:', data);
        this.indicateurForm.patchValue({
          title: data.title,
          description: data.description,
          familleId: data.famille?.id
        });
      },
      error: (err) => console.error('❌ Error loading indicateur:', err)
    });
  }

  onSubmit() {
    if (this.indicateurForm.invalid) return;

    const indicateurData = {
      title: this.indicateurForm.value.title,
      description: this.indicateurForm.value.description,
      famille: { id: this.indicateurForm.value.familleId }
    };

    if (this.isEditMode) {
      // ✅ Mode Modification
      this.indicateurService.updateIndicateur(this.id!, indicateurData).subscribe({
        next: () => {
          console.log('✅ Indicateur modifié avec succès !');
          this.router.navigate(['/service-competence/indicateurs']);
        },
        error: (err) => console.error('❌ Error updating indicateur:', err)
      });
    } else {
      // ✅ Mode Ajout
      this.indicateurService.addIndicateur(indicateurData).subscribe({
        next: () => {
          console.log('✅ Indicateur ajouté avec succès !');
          this.router.navigate(['/service-competence/indicateurs']);
        },
        error: (err) => console.error('❌ Error adding indicateur:', err)
      });
    }
  }
}
