import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { EmployeeService } from '../services/employee.service';
import * as bootstrap from 'bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EvaluationService } from '../services/evaluation.service';
import { Router } from '@angular/router';
import { KeycloakService } from 'src/app/Services/keycloak/keycloak.service';
import { ToastrService } from 'ngx-toastr';

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
  posts: any[] = []; 
  selectedPostId: string = '';

  constructor(
    private employeeService: EmployeeService,
    private modalService: NgbModal,
    private evaluationService: EvaluationService,
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private keycloakService: KeycloakService,
    private toastr: ToastrService
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
      competence: ['', Validators.required]
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
    this.getPosts();


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

  getPosts() {
    this.evaluationService.getAllPosts().subscribe({
      next: (data) => this.posts = data,
      error: (err) => console.error("❌ Erreur lors du chargement des postes", err)
    });
  }

  goToBulkEvaluation() {
    const ids = this.selectedEmployeeIds.join(',');
    this.router.navigate(['service-employee/evaluation'], { queryParams: { ids }});
  }

  filterByPost(postId: string) {
    this.selectedPostId = postId;
  
    if (!postId || postId === '') {
      this.filteredEmployees = [...this.employees]; // 🟢 Réinitialiser à tous les employés
      return;
    }
  
    this.filteredEmployees = this.employees.filter(e => e.post?.id == postId);
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
    if (!this.haveSamePost(this.selectedEmployees)) {
      // If employees do not have the same post, show an alert
      this.warningBar('Tous les employés doivent avoir le même poste pour évaluer.');
      return; // Don't open the modal if employees have different postIds
    }
  
    // Get the postId from the first employee (since all employees have the same post)
    const postId = this.selectedEmployees[0].post.id;
  
    // Fetch competences for the selected postId
    this.evaluationService.getCompetencesByPost(postId).subscribe(
      (competences) => {
        this.competences = competences;
        // Enable competence dropdown and disable famille & indicateur
        this.step1Form.controls['competence'].enable();
      },
      (error) => {
        console.error("❌ Error loading competences", error);
      }
    );
  
    // Reset forms and steps
    this.currentStep = 1;
    this.step1Form.reset();
    this.step2Form.reset();

      // Set today's date on step2Form
  const today = new Date().toISOString().split('T')[0]; // Get today’s date in YYYY-MM-DD format
  this.step2Form.patchValue({
    date: today
  });
  
    // Open the modal
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => console.log('Modal closed with:', result),
      (reason) => console.log('Closed with reason:', reason)
    );
  
    setTimeout(() => this.cdRef.detectChanges());
  }


  haveSamePost(employees: any[]): boolean {
    if (employees.length === 0) return false;  // If no employees are selected, return false
    const postId = employees[0].post.id;  // Get the postId of the first employee from the post object
    return employees.every(emp => emp.post.id === postId);  // Check if all selected employees have the same postId
  }

  loadFamilles() {
    this.evaluationService.getAllFamilles().subscribe(
      (data) => this.familles = data,
      (error) => console.error("❌ Error loading familles", error)
    );
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

    const firstName = this.keycloakService.profile?.firstName || '';
    const lastName = this.keycloakService.profile?.lastName || '';
    const nomEvaluator = `${firstName} ${lastName}`.trim();
  
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
      date: formattedDate, // Send the date as ISO string
      nomEvaluator: nomEvaluator
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

  warningBar(msg: string) {
    this.toastr.warning(msg, 'Attention', { timeOut: 2000, closeButton: true, progressBar: true });
  }


  toggleSelectAll(event: any) {
    const isChecked = event.target.checked;
  
    if (isChecked) {
      this.selectedEmployees = [...this.filteredEmployees];
    } else {
      this.selectedEmployees = [];
    }
  }
  
  isAllSelected(): boolean {
    return this.selectedEmployees.length === this.filteredEmployees.length && this.filteredEmployees.length > 0;
  }

}