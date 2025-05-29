import { Component, OnInit, TemplateRef } from '@angular/core';
import { SaisieElementService } from '../services/saisie-element.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-saisie-element',
  templateUrl: './saisie-element.component.html',
  styleUrls: ['./saisie-element.component.scss']
})
export class SaisieElementComponent implements OnInit {
  saisies: any[] = [];
  selectedElement: any = null;
  employeeMatricule: string | null = null;
competenceCode: string | null = null;
filteredSaisies: any[] = []; // la version filtrée
etatFilter: boolean | null | undefined = undefined;


  constructor(
    private saisieService: SaisieElementService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadSaisies();
  }

  getNiveauScore(niveau: string): number {
  switch (niveau?.toUpperCase()) {
    case 'DEBUTANT': return 1;
    case 'INTERMEDIAIRE': return 2;
    case 'AVANCE': return 3;
    case 'EXPERT': return 4;
    default: return 0;
  }
}


loadSaisies() {
  this.saisieService.getAll().subscribe((saisies: any[]) => {
    const promises = saisies.map(async (saisie: any) => {
      if (saisie.employeeId && saisie.competenceId) {
        try {
          const evaluations: any[] = await this.saisieService
            .getEvaluationsByEmployeeId(saisie.employeeId)
            .toPromise();

          const relatedEvals = evaluations.filter(e => e.competenceId === saisie.competenceId);
          const competenceTrouvee = relatedEvals.length > 0;
          saisie.etat = relatedEvals.length > 0;

          const niveauScores = evaluations.map(e => this.getNiveauScore(e.niveau));
          const moyenne = niveauScores.length > 0 ? niveauScores.reduce((a, b) => a + b, 0) / niveauScores.length : 0;

          this.saisieService.updateEtat(saisie.id, competenceTrouvee).subscribe();
          saisie.moyenneNiveau = moyenne;

        } catch (error) {
          saisie.etat = null;
          saisie.moyenneNiveau = 0;
        }
      } else {
        saisie.etat = null;
        saisie.moyenneNiveau = 0;
      }

      return saisie;
    });

    Promise.all(promises).then(saisiesFinales => {
      this.saisies = saisiesFinales;
      this.filteredSaisies = [...this.saisies];
    });
  });
}


 openDetailModal(row: any, modalContent: TemplateRef<any>) {
  this.selectedElement = row;

  // reset
  this.employeeMatricule = null;
  this.competenceCode = null;

  // Charger le matricule employé
  if (row.employeeId) {
    this.saisieService.getEmployeeById(row.employeeId).subscribe({
      next: (employee: any) => {
        this.employeeMatricule = employee?.matricule || 'N/A';
      },
      error: () => {
        this.employeeMatricule = 'Erreur';
      }
    });
  }

  // Charger le code compétence
  if (row.competenceId) {
    this.saisieService.getCompetenceById(row.competenceId).subscribe({
      next: (competence: any) => {
        this.competenceCode = competence?.code || 'N/A';
      },
      error: () => {
        this.competenceCode = 'Erreur';
      }
    });
  }

  this.modalService.open(modalContent, { size: 'lg' });
}

filterEtat(etat: boolean | null) {
  this.etatFilter = etat;
  this.filteredSaisies = this.saisies.filter((item) => item.etat === etat);
}

clearEtatFilter() {
  this.etatFilter = undefined;
  this.filteredSaisies = [...this.saisies];
}

filterByPerformance(level: 'high' | 'medium' | 'low') {
  if (level === 'high') {
    this.filteredSaisies = this.saisies.filter(s => s.moyenneNiveau >= 4);
  } else if (level === 'medium') {
    this.filteredSaisies = this.saisies.filter(s => s.moyenneNiveau >= 2 && s.moyenneNiveau < 4);
  } else if (level === 'low') {
    this.filteredSaisies = this.saisies.filter(s => s.moyenneNiveau > 0 && s.moyenneNiveau < 2);
  }
}

clearPerformanceFilter() {
  this.filteredSaisies = [...this.saisies];
}

exportExcel() {
  this.saisieService.exportExcel().subscribe(blob => {
    const a = document.createElement('a');
    const objectUrl = URL.createObjectURL(blob);
    a.href = objectUrl;
    a.download = 'liste_elements.xlsx';
    a.click();
    URL.revokeObjectURL(objectUrl);
  });
}


}