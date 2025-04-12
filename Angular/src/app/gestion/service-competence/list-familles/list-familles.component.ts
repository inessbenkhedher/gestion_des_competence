import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FamilleService } from '../services/famille.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DataLayerService } from 'src/app/shared/services/data-layer.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-list-familles',
  templateUrl: './list-familles.component.html',
  styleUrls: ['./list-familles.component.scss']
})
export class ListFamillesComponent implements OnInit {

  familles: any[] = []; // ✅ Store Familles
  deleteFamilleId: number | null = null;
  selectedFamilles: any[] = [];
  familleForm!: FormGroup;
  isEditMode = false;
  currentFamilleId: number | null = null;
  isLoading = false;

  constructor(
    private familleService: FamilleService,
    private router: Router,
    private modalService: NgbModal,
    private toastr: ToastrService
  
  ) {}

  ngOnInit(): void {
    console.log("🟢 ngOnInit exécuté !");
    this.initForm();
    this.loadFamilles();
    
  }



  initForm() {
    this.familleForm = new FormGroup({
      title: new FormControl('', Validators.required),
      description: new FormControl('')
    });
  }
  openDeleteModal(id: number, modalContent: any) {
    this.deleteFamilleId = id;
    this.modalService.open(modalContent, { ariaLabelledBy: 'modal-basic-title', centered: true });
  }

  confirmDelete(modal: NgbModalRef) {
    if (this.deleteFamilleId !== null) {
      this.familleService.deleteFamille(this.deleteFamilleId).subscribe({
        next: () => {
          console.log(`🗑️ Famille ${this.deleteFamilleId} supprimée`);
          this.familles = this.familles.filter(f => f.id !== this.deleteFamilleId);
          modal.close('deleted');
          this.deleteFamilleId = null;
        },
        error: (err) => {
          console.error('❌ Error deleting famille:', err);
          modal.dismiss('error');
        }
      });
    }
  }

  loadFamilles() {
    console.log("📡 Chargement des familles...");
    this.familleService.getAllFamilles().subscribe({
      next: (data) => {
        
        this.familles = data;
      },
      error: (err) => console.error('❌ Erreur lors du chargement des familles:', err)
    });
  }




  onRowSelect(row: any) {
    this.selectedFamilles = this.familles.filter(f => f.selected);
  }
  
  toggleSelection(row: any) {
    if (this.selectedFamilles.length === 1 && this.selectedFamilles[0].id === row.id) {
      this.selectedFamilles = [];
    } else {
      this.selectedFamilles = [row];
    }
  }

  
  handleDelete(modalContent: any) {
    if (this.selectedFamilles.length !== 1) {
      this.warningBar("Veuillez sélectionner une famille à supprimer.");
      return;
    }
  
    const id = this.selectedFamilles[0].id;
    this.openDeleteModal(id, modalContent);
  }
  
  warningBar(msg: string) {
    this.toastr.warning(msg, 'Attention', {
      timeOut: 2000, // ⏱️ Alert shown for 2 seconds
      closeButton: true,
      progressBar: true
    });
  }








  createFamille(modalRef: any) {
    this.isEditMode = false;
    this.familleForm.reset();
    this.modalService.open(modalRef, { size: 'md' });
  }
  handleEdit(modalRef: any) {
    if (this.selectedFamilles.length !== 1) {
      this.warningBar("Veuillez sélectionner une seule famille à modifier.");
      return;
    }
  
    this.isEditMode = true;
    this.currentFamilleId = this.selectedFamilles[0].id;
  
    this.familleForm.patchValue({
      title: this.selectedFamilles[0].title,
      description: this.selectedFamilles[0].description
    });
  
    this.modalService.open(modalRef, { size: 'md' });
  }

  onSubmit(modal: any) {
    if (this.familleForm.invalid) return;

    this.isLoading = true;
    const familleData = this.familleForm.value;

    const action$ = this.isEditMode
      ? this.familleService.updateFamille(this.currentFamilleId!, familleData)
      : this.familleService.addFamille(familleData);

    action$.subscribe({
      next: () => {
        this.loadFamilles();
        modal.close();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('❌ Error:', err);
        this.isLoading = false;
      }
    });
  }



}
