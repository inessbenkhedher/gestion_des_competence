import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../services/employee.service';
import { EvaluationService } from '../services/evaluation.service';
import { KeycloakService } from 'src/app/Services/keycloak/keycloak.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-evalueremp',
  templateUrl: './evalueremp.component.html',
  styleUrls: ['./evalueremp.component.scss']
})
export class EvaluerempComponent implements OnInit {
  employeeIds: number[] = [];
  employees: any[] = [];
  competences: any[] = [];
  niveaux: string[] = [];
  selectedLevels: { [competenceId: number]: string } = {};

  form!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private empSrv: EmployeeService,
    private evalSrv: EvaluationService,
    private fb: FormBuilder,
    private keycloakService: KeycloakService,
  ) {}

  ngOnInit() {
    // 1) On récupère les IDs d'employés depuis les query params
    this.route.queryParamMap.subscribe(params => {
      const ids = params.get('ids') || '';
      this.employeeIds = ids.split(',').map(s => +s).filter(n => !!n);
      this.empSrv.getEmployees().subscribe(list => {
        this.employees = list.filter(e => this.employeeIds.includes(e.id));
      });
    });
    this.empSrv.getEmployees().subscribe(list => {
      this.employees = list.filter(e => this.employeeIds.includes(e.id));
    
      // 👉 Sélectionne automatiquement le premier employé dans la liste
      if (this.employees.length > 0) {
        const firstId = this.employees[0].id;
        this.form.get('employee')!.setValue(firstId);
      }
    });

    // 2) On charge les niveaux possibles
    this.evalSrv.getNiveaux().subscribe(ns => this.niveaux = ns);

    // 3) On construit le formulaire et on pré-remplit la date
    const today = new Date().toISOString().substring(0, 10);
    this.form = this.fb.group({
      employee: [null, Validators.required],
      date: [today, Validators.required],
      commentaire: ['']
    });

    // 4) À chaque changement de sélection d'employé, on recharge les compétences
    this.form.get('employee')!
    .valueChanges
    .pipe(filter(empId => !!empId))
    .subscribe(empId => this.onEmployeeChange(empId));
  }

  onEmployeeChange(empId: number) {
    if (!empId) {
      this.competences = [];
      return;
    }
    // On récupère l’employé complet pour accéder à son post.id
    this.empSrv.getEmployeeById(empId)
      .subscribe(emp => {
        this.evalSrv.getCompetencesByPost(emp.post.id)
          .subscribe(comps => {
            this.competences = comps;
            this.selectedLevels = {};
          });
      });
  }

  submit() {
    if (this.form.invalid || this.competences.length === 0) {
      return;
    }
  
    const firstName = this.keycloakService.profile?.firstName || '';
    const lastName  = this.keycloakService.profile?.lastName  || '';
  
    // On filtre pour ne garder que les compétences avec un niveau sélectionné
    const filteredCompetences = this.competences
      .filter(c => this.selectedLevels[c.id]) // garde seulement si un niveau est défini
      .map(c => ({
        competenceId: c.id,
        niveau: this.selectedLevels[c.id]
      }));
  
    if (filteredCompetences.length === 0) {
      alert("Veuillez attribuer au moins un niveau de compétence.");
      return;
    }
  
    const payload = {
      employeeId: this.form.value.employee,
      competenceLevels: filteredCompetences,
      date: new Date(this.form.value.date).toISOString(),
      statut: '—',
      commentaire: this.form.value.commentaire,
      nomEvaluator: `${firstName} ${lastName}`.trim()
    };
  
    this.evalSrv.bulkAssignEvaluation(payload)
      .subscribe(() => alert('Évaluation enregistrée !'));
  }

}
