import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { EmployeeService } from '../services/employee.service';
import * as bootstrap from 'bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EvaluationService } from '../services/evaluation.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {
  
  currentStep: number = 1;
  selectionForm: FormGroup;
  searchControl: FormControl = new FormControl('');
  employees: any[] = [];
  filteredEmployees: any[] = [];
  selectedEmployees: any[] = [];
evaluationForm: any;
familles: any[] = [];
  indicateurs: any[] = [];
  competences: any[] = [];
  step1Form: FormGroup;
  step2Form: FormGroup;
  niveaux: string[] = [];

  constructor(
    private employeeService: EmployeeService,
    private modalService: NgbModal,
    private evaluationService: EvaluationService,
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private router: Router
  ) {
   
  
  }


    
ngAfterViewInit() {
  this.cdRef.detectChanges(); // Forcer Angular à re-check les changements après la vue initiale
}


  ngOnInit() {

    this.selectionForm = this.fb.group({
      employees: [[], Validators.required], // ou null selon ton besoin
      competence: [null, Validators.required]
    });
    this.step1Form = this.fb.group({
      famille: ['', Validators.required],
      indicateur: ['', Validators.required],
      competence: ['', Validators.required],
    });
  
    this.step2Form = this.fb.group({
      date: ['', Validators.required],
      statut: ['', Validators.required],
      commentaire: [''],
      niveau: ['', Validators.required]
    });
    this.evaluationService.getNiveaux().subscribe(
      data => this.niveaux = data,
      error => console.error('❌ Erreur lors du chargement des niveaux', error)
    );

    this.step1Form.controls['indicateur'].disable();
this.step1Form.controls['competence'].disable();
    this.loadFamilles();
    this.employeeService.getEmployees().subscribe((res: any[]) => {
      this.employees = [...res];
      this.filteredEmployees = res;
    });

    // Listen to search input changes and fetch filtered employees
    this.searchControl.valueChanges.pipe(
      debounceTime(300),  // Avoids too many API calls
      distinctUntilChanged(),
      switchMap(searchTerm => 
        searchTerm.trim() 
          ? this.employeeService.searchEmployeesByPost(searchTerm) 
          : this.employeeService.getEmployees()  // If empty, fetch all employees
      )
    ).subscribe(filteredResults => {
      this.filteredEmployees = filteredResults;
    });
  }

  toggleSelection(employee: any) {
    const index = this.selectedEmployees.findIndex(e => e.id === employee.id);
    if (index > -1) {
      this.selectedEmployees.splice(index, 1);
    } else {
      this.selectedEmployees.push(employee);
    }
  }

  open(content: any) {
    this.currentStep = 1;
    this.step1Form.reset();
    this.step2Form.reset();
  
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => console.log('Modal closed with:', result),
      (reason) => console.log('Closed with reason:', reason)
    );
  
    setTimeout(() => this.cdRef.detectChanges());
  }


  loadFamilles() {
    this.evaluationService.getAllFamilles().subscribe(
      (data) => this.familles = data,
      (error) => console.error("❌ Error loading familles", error)
    );
  }

  onFamilleSelect(familleId: number) {
    this.indicateurs = [];  // Reset indicators
    this.competences = [];  // Reset competences
    this.step1Form.patchValue({ indicateur: null, competence: null });

    if (familleId) {
      this.evaluationService.getIndicateursByFamille(familleId).subscribe(
        (data) => {
          this.indicateurs = data;
          this.step1Form.controls['indicateur'].enable();
        },
        (error) => console.error("❌ Error loading indicateurs", error)
      );
    } else {
      this.step1Form.controls['indicateur'].disable();
      this.step1Form.controls['competence'].disable();
    }
  }

  onIndicateurSelect(indicateurId: number) {
    this.competences = [];
    this.step1Form.patchValue({ competence: null });

    if (indicateurId) {
      this.evaluationService.getCompetencesByIndicateur(indicateurId).subscribe(
        (data) => {
          this.competences = data;
          this.step1Form.controls['competence'].enable();
        },
        (error) => console.error("❌ Error loading competences", error)
      );
    } else {
      this.step1Form.controls['competence'].disable();
    }
  }


  onStepNext() {
    if (this.currentStep === 1) {
      this.step1Form.markAllAsTouched();
      if (this.step1Form.invalid) {
        alert('Veuillez remplir tous les champs du premier formulaire.');
        return;
      }
      this.currentStep = 2; // passe à l'étape 2
    } else if (this.currentStep === 2) {
      this.step2Form.markAllAsTouched();
      if (this.step2Form.invalid) {
        alert('Veuillez remplir tous les champs du deuxième formulaire.');
        return;
      }
      console.log('✔️ Tout est valide, prêt à soumettre');
      // Tu peux maintenant appeler submitForm();
    }
  }

  get selectedEmployeeIds(): number[] {
    return this.selectedEmployees.map(e => e.id);
  }

  get selectedCompetenceId(): number {
    return this.step1Form.get('competence')?.value;
  }


  isStep1Valid(): boolean {
    return this.evaluationForm.get('famille')?.valid &&
           this.evaluationForm.get('indicateur')?.valid &&
           this.evaluationForm.get('competence')?.valid;
  }



  goToStep(step: number): void {
    this.currentStep = step;
  }





  submitEvaluation() {
    if (!this.step1Form || !this.step2Form) {
      console.error("Les formulaires ne sont pas initialisés.");
      return;
    }
  
    const competenceControl = this.step1Form.get('competence');
    const dateControl = this.step2Form.get('date');
  
    if (!competenceControl || !dateControl) {
      console.error("Certains contrôles de formulaire sont manquants.");
      return;
    }
  
    const competenceId = competenceControl.value;
    const date = dateControl.value;
  
    if (!competenceId || !date) {
      console.warn("Compétence ou date manquante.");
      return;
    }
  
    // Convert date string to Date object, then to ISO string
    const formattedDate = new Date(date).toISOString();
  
    // Prepare the bulk evaluation data
    const bulkEvaluationData = {
      employeeIds: this.selectedEmployees.map(e => e.id), // An array of selected employee IDs
      competenceId,
      statut: this.step2Form.value.statut,
      commentaire: this.step2Form.value.commentaire,
      niveau: this.step2Form.value.niveau,
      date: formattedDate // Send the date as ISO string
    };
  
    // Call the bulk evaluation API
    this.evaluationService.bulkAssignEvaluation(bulkEvaluationData).subscribe(
      response => {
        console.log("✅ Évaluation soumise avec succès", response);
        this.modalService.dismissAll(); // Close the modal
      },
      error => {
        console.error("❌ Erreur lors de la soumission de l’évaluation", error);
      }
    );
  }





  goToEmployeeDetails(id: any): void {
    this.router.navigate(['service-evaluation/employee-details', id]);
  }













}