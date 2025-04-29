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
  employeeStatuses: { [key: number]: string } = {};
  showSelectionColumn: boolean = false;
  etatFilter: string | null = null;


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

      // Recherche avec délai
      this.searchControl.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(searchTerm =>
          searchTerm.trim()
            ? this.employeeService.getEmployeeByNom(searchTerm)
            : this.employeeService.getEmployees()
        )
      ).subscribe(filteredResults => {
        this.filteredEmployees = filteredResults;
      
        // ✅ Logique de vérif si tous ont le même post.id
        if (filteredResults.length > 0) {
          const firstPostId = filteredResults[0]?.post?.id;
          const samePost = filteredResults.every(emp => emp.post?.id === firstPostId);
          this.showSelectionColumn = samePost;
          this.selectedPostId = samePost ? firstPostId : '';
        } else {
          this.showSelectionColumn = false;
          this.selectedPostId = '';
        }
      });


    this.selectionForm = this.fb.group({
      employees: [[], Validators.required], // ou null selon ton besoin
      competence: [null, Validators.required]
    });
  

    this.getPosts();


    this.loadFamilles();
    this.employeeService.getEmployees().subscribe((res: any[]) => {
      this.employees = [...res];
      this.filteredEmployees = res;
      console.log(this.filteredEmployees);
      
    });
    this.employeeService.getEmployees().subscribe((res: any[]) => {
      this.employees = [...res];
      this.filteredEmployees = res;
    
      // ✅ Appeler ici, une fois qu'on a bien les employés
      this.filteredEmployees.forEach(e => {
        this.employeeStatuses[e.id] = "loading";
        this.getEmployeeStatus(e.id).then(status => {
          this.employeeStatuses[e.id] = status;
        }).catch(error => {
          console.error(`Erreur statut ${e.id}`, error);
          this.employeeStatuses[e.id] = "rouge";
        });
      });
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

  filterByEtat(etat: 'rouge' | 'orange' | 'vert') {
    this.etatFilter = etat;
    this.applyAllFilters();
  }
  
  clearEtatFilter() {
    this.etatFilter = null;
    this.applyAllFilters();
  }

  applyAllFilters() {
    this.filteredEmployees = this.employees.filter(emp => {
      const postMatch = !this.selectedPostId || emp.post?.id == this.selectedPostId;
      const etatMatch = !this.etatFilter || this.employeeStatuses[emp.id] === this.etatFilter;
      const searchTerm = this.searchControl.value?.toLowerCase() || '';
      const nameMatch = `${emp.nom} ${emp.prenom}`.toLowerCase().includes(searchTerm);
      return postMatch && etatMatch && nameMatch;
    });
  }


  exportEmployeesToExcel() {
    this.employeeService.exportEmployees().subscribe({
      next: (response) => {
        const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'Employees.xlsx'; // File name
        link.click();
        console.log('✅ Export success!');
      },
      error: (err) => console.error('❌ Export failed:', err)
    });
  }

  async getEmployeeStatus(employeeId: number): Promise<"rouge" | "orange" | "vert"> {
    try {
      const profil = await this.evaluationService.getProfilIA(employeeId).toPromise();
      console.log(profil); // Ajoutez ceci pour voir les données du profil
      const niveaux = ["DEBUTANT", "INTERMEDIAIRE", "AVANCE", "EXPERT"];
      const niveauIndex = (niveau: string) => niveaux.indexOf(niveau);
  
      if (!profil.competences || profil.competences.length === 0) {
        return "rouge"; // aucune évaluation
      }
  
      const hasGap = profil.competences.some((c: any) =>
        niveauIndex(c.niveau_requis) - niveauIndex(c.niveau_actuel) >= 2
      );
  
      const allRequired = await this.evaluationService.getCompetencesByPost(profil.poste_id).toPromise();
      const evalueesIds = profil.competences.map((c: any) => c.competence_id);
      const nonEvaluees = allRequired.filter((c: any) => !evalueesIds.includes(c.id));
  
      if (hasGap || nonEvaluees.length > 0) {
        return "orange";
      }
      if (profil.hasNoEvaluations) {
        return "rouge"; // ou 🔴
      }
  
      return "vert";
    } catch (error) {
      console.error("Erreur IA", error);
      return "rouge"; // fallback
    }
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




  get selectedEmployeeIds(): number[] {
    return this.selectedEmployees.map(e => e.id);
  }

  get selectedCompetenceId(): number {
    return this.step1Form.get('competence')?.value;
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