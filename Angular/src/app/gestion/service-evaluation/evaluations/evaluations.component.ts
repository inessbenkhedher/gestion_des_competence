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

  selectedEvaluation: any = {
    date: '',
    statut: '',
    niveau: '',
    commentaire: ''
  };
  niveaux: string[] = [];

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
        const compId = evaluation.competenceId; // ✅ correction ici
        const evalDate = new Date(evaluation.date);
  
        if (!seenCompetences.has(compId)) {
          seenCompetences.set(compId, evaluation);
          filtered.push(evaluation); // ✅ keep the first one
        } else {
          const existingEval = seenCompetences.get(compId);
          const existingDate = new Date(existingEval.date);
  
          if (evalDate > existingDate) {
            // replace the older one in filtered[]
            const index = filtered.findIndex(e => e.competenceId === compId);
            if (index !== -1) {
              filtered[index] = evaluation;
            }
            seenCompetences.set(compId, evaluation);
          }
        }
      });
  
      this.evaluations = filtered;
      console.log("✅ Final evaluations:", this.evaluations);
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

  goToHistory(evaluation: any) {
    this.router.navigate([
      'service-evaluation/employee', 
      this.employeeId, // 🔥 utilise l’ID déjà récupéré depuis l’URL
      'competence', 
      evaluation.competenceId, 
      'history'
    ]);
  }
  
}
