import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
    private keycloakService: KeycloakService
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
      this.evaluations = data as any[];;
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
      date: evaluation.date ? new Date(evaluation.date).toISOString().split('T')[0] : '',
      statut: evaluation.statut || '',
      niveau: evaluation.niveau || '',
      commentaire: evaluation.commentaire || ''
    };
  
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
}
