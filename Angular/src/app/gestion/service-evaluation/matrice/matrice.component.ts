import { Component, OnInit } from '@angular/core';
import { MatriceService } from '../services/matrice.service';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-matrice',
  templateUrl: './matrice.component.html',
  styleUrls: ['./matrice.component.scss']
})
export class MatriceComponent implements OnInit {
  familles: any[] = [];
  selectedFamilleId: number | null = null;
 searchControl: FormControl = new FormControl('');
 indicateurs: any[] = [];
competencesGroupedByIndicateur: any = {}; // { idIndicateur: [compétences] }
employees: any[] = [];
evaluations: any[] = [];
posts: any[] = [];
selectedPostId: number | null = null;
 
filteredEmployees: any[] = [];

  constructor(private matriceService: MatriceService) {}

  ngOnInit(): void {
    this.matriceService.getAllFamilles().subscribe({
      next: (data) => {
        this.familles = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des familles', err);
      }
    });
    this.matriceService.getAllPosts().subscribe(data => {
      this.posts = data;
    });

 

    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => this.applyFilters());
    
    this.matriceService.getAllPosts().subscribe(data => this.posts = data);
    this.matriceService.getEmployees().subscribe(data => {
      this.employees = data;
      this.applyFilters();
    });
  }
  applyFilters() {
    this.matriceService.getEmployees().subscribe(employees => {
      this.employees = employees;
  
      this.filteredEmployees = employees.filter(emp => {
        const matchPost = !this.selectedPostId || emp.post?.id === +this.selectedPostId;
        const searchTerm = this.searchControl.value?.toLowerCase() || '';
        const matchSearch =
          emp.nom?.toLowerCase().includes(searchTerm) ||
          emp.prenom?.toLowerCase().includes(searchTerm) ||
          emp.matricule?.toLowerCase().includes(searchTerm);
  
        return matchPost && (!searchTerm || matchSearch);
      });
    });
  }

  onFamilleChange() {
    if (!this.selectedFamilleId) return;
  
    this.matriceService.getIndicateursByFamille(this.selectedFamilleId).subscribe(indics => {
      this.indicateurs = indics;
      this.competencesGroupedByIndicateur = {};
  
      // Pour chaque indicateur, charger les compétences
      indics.forEach(indic => {
        this.matriceService.getCompetencesByIndicateur(indic.id).subscribe(competences => {
          this.competencesGroupedByIndicateur[indic.id] = competences;
        });
      });
    });
  
    // Recharger les évaluations
    this.loadEvaluations();
  }

  loadEvaluations() {
    this.matriceService.getAllEvaluations().subscribe(evals => {
      this.evaluations = evals;
      console.log('Évaluations chargées:', this.evaluations);
    });
  }
  getNiveauFor(employeeId: number, competenceId: number): string | null {
    const evaluation = this.evaluations.find(e =>
      e.employee.id === employeeId && e.competence.id === competenceId
    );
  
    if (evaluation) {
      return evaluation.niveau;
    } else {
      
      return '❌';
    }
  }
  onPostChange() {
    this.applyFilters();
  }
  

  exportPostEvaluationExcel() {
    if (!this.selectedPostId) return;
  
    this.matriceService.exportExcelByPost(this.selectedPostId).subscribe({
      next: (blob: Blob) => {
        const a = document.createElement('a');
        const objectUrl = window.URL.createObjectURL(blob);
        a.href = objectUrl;
        a.download = `evaluation_post_${this.selectedPostId}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(objectUrl);
      },
      error: (err) => {
        console.error('❌ Export échoué:', err);
        alert("Erreur lors de l'export du fichier.");
      }
    });
  }

}
