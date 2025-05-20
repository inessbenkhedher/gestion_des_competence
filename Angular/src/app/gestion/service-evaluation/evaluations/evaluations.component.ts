import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../service-employee/services/employee.service';
import { EvaluationService } from '../services/evaluation.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { KeycloakService } from 'src/app/Services/keycloak/keycloak.service';

@Component({
  selector: 'app-evaluations',
  templateUrl: './evaluations.component.html',
  styleUrls: ['./evaluations.component.scss']
})
export class EvaluationsComponent implements OnInit {
  employeeId!: number;
  employee: any;
  evaluations: any[] = [];

  deleteEvaluationId: number | null = null;

  selectedEvaluation: any = {
    date: '',
    statut: '',
    niveau: '',
    commentaire: ''
  };
  niveaux: string[] = [];
  competencesFaibles: any[] = [];
competencesNonEvaluees: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private evaluationService: EvaluationService,
    private modalService: NgbModal,
    private keycloakService: KeycloakService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.employeeId = +this.route.snapshot.paramMap.get('id')!;
    this.getEmployeeDetails();
    this.getEvaluations();
    this.getNiveaux();
    this.analyseProfilIA();
  }

  analyseProfilIA() {
    this.evaluationService.getProfilIA(this.employeeId).subscribe((profil: any) => {
      const niveaux = ["DEBUTANT", "INTERMEDIAIRE", "AVANCE", "EXPERT"];
      const niveauIndex = (niveau: string) => niveaux.indexOf(niveau);
  
      this.competencesFaibles = profil.competences.filter(c => 
        niveauIndex(c.niveau_requis) - niveauIndex(c.niveau_actuel) >= 2
      );
  
      this.evaluationService.getCompetencesByPostId(profil.poste_id).subscribe((allRequired: any[]) => {
        const evalueesIds = profil.competences.map((c: any) => c.competence_id);
        this.competencesNonEvaluees = allRequired.filter(c => !evalueesIds.includes(c.id));
      });
    });
  }
  
  goToEmployeeDashboard() {
  const ecartsCount = this.competencesFaibles.length + this.competencesNonEvaluees.length;
  this.router.navigate(['/service-employee/dashboardemploye', this.employeeId], {
    queryParams: { ecarts: ecartsCount }
  });
}

  getEmployeeDetails() {
    this.evaluationService.getEmployeeById(this.employeeId).subscribe(data => {
      this.employee = data;
    });

  }

  getEvaluations() {
    this.evaluationService.getEvaluationsByEmployeeId(this.employeeId).subscribe(data => {
      const allEvals = data as any[];
  
      const seenCompetences = new Map<number, any>();
      const filtered: any[] = [];
  
      allEvals.forEach(evaluation => {
        const compId = evaluation.competenceId;
        const evalDate = new Date(evaluation.date);
  
        if (!seenCompetences.has(compId)) {
          seenCompetences.set(compId, evaluation);
          filtered.push(evaluation);
        } else {
          const existingEval = seenCompetences.get(compId);
          const existingDate = new Date(existingEval.date);
  
          if (evalDate > existingDate) {
            const index = filtered.findIndex(e => e.competenceId === compId);
            if (index !== -1) {
              filtered[index] = evaluation;
            }
            seenCompetences.set(compId, evaluation);
          }
        }
      });
  
      // 🔄 Maintenant on enrichit chaque évaluation avec sa compétence
      filtered.forEach(evaluation => {
        this.evaluationService.getCompetenceById(evaluation.competenceId).subscribe(competence => {
          evaluation.competence = competence;
        });
      });
  
      this.evaluations = filtered;
    });
  }

  getNiveaux() {
    this.evaluationService.getNiveaux().subscribe(data => {
      this.niveaux = data;
    });
  }

  openEditModal(evaluation: any, modalRef: any) {
    console.log('📝 Evaluation before edit:', evaluation); // Add this!
    
    this.selectedEvaluation = {
      ...evaluation,
      
      statut: evaluation.statut || '',
      niveau: evaluation.niveau || '',
      commentaire: evaluation.commentaire || ''
    };
    const today = new Date().toISOString().split('T')[0]; // Get today’s date in YYYY-MM-DD format
    this.selectedEvaluation.date = today; // Correct assignment
  
    this.modalService.open(modalRef, { ariaLabelledBy: 'modal-basic-title' });
  }
  
  submitEdit(modal: any) {
    if (!this.selectedEvaluation.id) {
      console.error('❌ ID is missing!');
      return;
    }

    const firstName = this.keycloakService.profile?.firstName || '';
    const lastName = this.keycloakService.profile?.lastName || '';
    this.selectedEvaluation.nomEvaluator = `${firstName} ${lastName}`.trim();
  
    this.evaluationService.updateEvaluation(this.selectedEvaluation.id, this.selectedEvaluation).subscribe(() => {
      this.getEvaluations(); // Refresh list
      modal.close();
    });
  }


  deleteEvaluation(id: number) {
    this.evaluationService.deleteEvaluation(id).subscribe(() => {
      this.evaluations = this.evaluations.filter(e => e.id !== id);
    });
  }


   openDeleteModal(id: number, modalContent: any) {
      this.deleteEvaluationId = id;
      this.modalService.open(modalContent, { ariaLabelledBy: 'modal-basic-title', centered: true });
    }
  
    confirmDelete(modal: any) {
      if (this.deleteEvaluationId !== null) {
        this.evaluationService.deleteEvaluation(this.deleteEvaluationId).subscribe({
          next: () => {
            console.log(`🗑️ Famille ${this.deleteEvaluationId} supprimée`);
            this.evaluations = this.evaluations.filter(f => f.id !== this.deleteEvaluationId);
            modal.close('deleted');
            this.deleteEvaluationId = null;
          },
          error: (err) => {
            console.error('❌ Error deleting famille:', err);
            modal.dismiss('error');
          }
        });
      }
    }
  

  goToHistory(evaluation: any) {
    this.router.navigate([
      'service-evaluation/employee', 
      this.employeeId, // 🔥 utilise l’ID déjà récupéré depuis l’URL
      'competence', 
      evaluation.competenceId, 
      'history'
    ]);
  }

  goToBulkEvaluation() {
    const ids = this.employeeId;
    this.router.navigate(['service-employee/evaluation'], { queryParams: { ids }});
  }
  
}
