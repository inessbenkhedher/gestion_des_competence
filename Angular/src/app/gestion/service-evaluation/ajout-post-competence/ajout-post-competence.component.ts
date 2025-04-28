import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PostcomptenceService } from '../services/postcomptence.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ajout-post-competence',
  templateUrl: './ajout-post-competence.component.html',
  styleUrls: ['./ajout-post-competence.component.scss']
})
export class AjoutPostCompetenceComponent implements OnInit {
  postes: any[] = [];
  familles: any[] = [];
  indicateurs: any[] = [];
  competences: any[] = [];
  niveaux: string[] = [];

  selectedPostId: number | null = null;
  selectedFamilleId: number | null = null;
  selectedIndicateurId: number | null = null;

  selectedLevels: { [competenceId: number]: string } = {};

  constructor(
    private service: PostcomptenceService,
    private toastr: ToastrService,
     private router: Router
  ) {}

  ngOnInit(): void {
    this.service.getAllPostes().subscribe(data => this.postes = data);
    this.service.getAllFamilles().subscribe(data => this.familles = data);
    this.service.getNiveaux().subscribe(data => this.niveaux = data);
  }

  onFamilleChange() {
    this.selectedIndicateurId = null;
    this.competences = [];
    this.selectedLevels = {};
    if (this.selectedFamilleId) {
      this.service.getIndicateursByFamille(this.selectedFamilleId).subscribe(data => {
        this.indicateurs = data;
      });
    }
  }

  onIndicateurChange() {
    this.selectedLevels = {};
    if (this.selectedIndicateurId) {
      this.service.getCompetencesByIndicateur(this.selectedIndicateurId).subscribe(data => {
        this.competences = data;
      });
    }
  }

  canSubmit(): boolean {
    return this.selectedPostId && this.selectedFamilleId && this.selectedIndicateurId &&
      Object.keys(this.selectedLevels).length > 0;
  }

  submit() {
    const payload = {
      posteId: this.selectedPostId,
      competences: Object.entries(this.selectedLevels).map(([competenceId, niveau]) => ({
        competenceId: +competenceId,
        niveau
      }))
    };
    
    this.service.add(payload).subscribe({
      next: () => {
        this.toastr.success("✅ Compétences ajoutées");
        
      },
      error: () => this.toastr.error("❌ Erreur lors de l'ajout")
    });

    // Reset
    this.selectedLevels = {};
  }
}
