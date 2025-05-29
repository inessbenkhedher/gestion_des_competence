import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SaisieElementService {


  private baseUrl = '/api';
  
   constructor(private http: HttpClient) {}

  getAll(): Observable<any> {
       return this.http.get<any[]>(`${this.baseUrl}/elements`).pipe(
           catchError(error => {
             console.error('❌ Error fetching evaluation:', error);
             return throwError(() => new Error("Erreur lors du chargement des employee"));
           })
         );
  }

        getElementById(elementId: number) {
    return this.http.get(`${this.baseUrl}/elements/${elementId}`);
  }

     getEmployeeById(id: number) {
    return this.http.get(`${this.baseUrl}/employees/${id}`);
  } 


    getCompetenceById(competenceId: number) {
    return this.http.get(`/api/competences/${competenceId}`);
  }
 updateEtat(id: number, etat: boolean) {
  return this.http.put(`${this.baseUrl}/elements/${id}/etat?etat=${etat}`, {});
}

    getEvaluationsByEmployeeId(employeeId: number) {
    return this.http.get<any[]>(`${this.baseUrl}/evaluation/employee/${employeeId}/competences`);
  }

  exportExcel(): Observable<Blob> {
  return this.http.get('/api/elements/export/excel', {
    responseType: 'blob'
  });
}

}