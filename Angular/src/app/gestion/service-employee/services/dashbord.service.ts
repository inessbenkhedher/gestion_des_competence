import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DashbordService {

  private baseUrl = '/api';
  
    constructor(private http: HttpClient) {}

      getEvaluationsByEmployeeId(employeeId: number) {
    return this.http.get(`${this.baseUrl}/evaluation/employee/${employeeId}/competences`);
  }

    getallEvaluations(): Observable<any>{
         return this.http.get(`${this.baseUrl}/evaluation`).pipe(
        catchError(error => {
          console.error('❌ Error fetching employee:', error);
          return throwError(() => new Error("Erreur lors du chargement des employee"));
        })
      );
    }
  

    getallPosts() :Observable<any> {
         return this.http.get(`${this.baseUrl}/posts`).pipe(
        catchError(error => {
          console.error('❌ Error fetching employee:', error);
          return throwError(() => new Error("Erreur lors du chargement des employee"));
        })
      );
    }
 

    getEmployees(): Observable<any> {
      return this.http.get(`${this.baseUrl}/employees`).pipe(
        catchError(error => {
          console.error('❌ Error fetching employee:', error);
          return throwError(() => new Error("Erreur lors du chargement des employee"));
        })
      );
    }
  
  getProfilIA(employeeId: number) {
    return this.http.get(`${this.baseUrl}/evaluation/profil-ia/${employeeId}`);
  }

    getEmployeeById(id: number) {
    return this.http.get(`${this.baseUrl}/employees/${id}`);
  } 

   getNiveaux() {
    return this.http.get<string[]>(`${this.baseUrl}/evaluation/niveaux`); // adapte le path
  }

  getEvaluationHistory(employeeId: number, competenceId: number) {
    return this.http.get<any[]>(`${this.baseUrl}/evaluation/history/${employeeId}/${competenceId}`);
  }

  getCompetencesByPostId(postId: number) {
    return this.http.get(`${this.baseUrl}/postcompetence/${postId}/competences`);
  }
  getCompetenceById(competenceId: number) {
    return this.http.get(`/api/competences/${competenceId}`);
  }

    getAllCompetences(): Observable<any> {
    return this.http.get(`${this.baseUrl}/competences`).pipe(
      catchError(error => {
        console.error('❌ Error fetching competences:', error);
        return throwError(() => new Error("Erreur lors du chargement des compétences"));
      })
    );
  }

    getCompetencesByPost(postId : number): Observable<any> {
    return this.http.get(`api/postcompetence/${postId}/competences`).pipe(
      catchError(error => {
        console.error('❌ Error fetching competences:', error);
        return throwError(() => new Error("Erreur lors du chargement des competence"));
      })
    );
  }

  

  
}
