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
 
  filteredEmployees: unknown;

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

    this.matriceService.getEmployees().subscribe(data => {
      this.filteredEmployees = data;
    });

    this.searchControl.valueChanges.pipe(
          debounceTime(300),  // Avoids too many API calls
          distinctUntilChanged(),
          switchMap(searchTerm => 
            searchTerm.trim() 
              ? this.matriceService.searchEmployeesByPost(searchTerm) 
              : this.matriceService.getEmployees()  // If empty, fetch all employees
          )
        ).subscribe(filteredResults => {
          this.filteredEmployees = filteredResults;
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
  
  

}
