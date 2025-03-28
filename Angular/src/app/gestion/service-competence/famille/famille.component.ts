import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FamilleService } from '../services/famille.service';
import { KeycloakService } from 'src/app/Services/keycloak/keycloak.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-famille',
  templateUrl: './famille.component.html',
  styleUrls: ['./famille.component.scss']
})
export class FamilleComponent {
  id: number | null = null;
  familleForm!: FormGroup;  // ✅ Declare it properly
  isLoading = false;
  isEditMode = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private familleService: FamilleService,
    private keycloakService: KeycloakService,
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


    // ✅ Initialize `familleForm` correctly inside `ngOnInit`
    this.familleForm = this.fb.group({
      title: ['', Validators.required],
      description: ['']
    });
  }

  loadIndicateur(id: number) {
    this.familleService.getFamilleById(id).subscribe({
      next: (data) => {
        console.log('📥 Loaded Indicateur:', data);
        this.familleForm.patchValue({
          title: data.title,
          description: data.description
        });
      },
      error: (err) => console.error('❌ Error loading indicateur:', err)
    });
  }

  onSubmit() {
    if (this.familleForm.invalid) return;
  
    const familleData = {
      title: this.familleForm.value.title,
      description: this.familleForm.value.description 
    };

    if (this.isEditMode) {
      // ✅ Mode Modification
      this.familleService.updateFamille(this.id!, familleData).subscribe({
        next: () => {
          console.log('✅ famille modifié avec succès !');
          this.router.navigate(['/service-competence/familles']);
        },
        error: (err) => console.error('❌ Error updating familles:', err)
      });
    } else {
      // ✅ Mode Ajout
      this.familleService.addFamille(familleData).subscribe({
        next: () => {
          console.log('✅ famille ajouté avec succès !');
          this.router.navigate(['/service-competence/familles']);
        },
        error: (err) => console.error('❌ Error adding famille:', err)
      });
    }
  }

}
