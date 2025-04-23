import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) {}

  getAllFamilles(): Observable<any> {
    return this.http.get(`${this.apiUrl}/familles`).pipe(
      catchError(error => {
        console.error('❌ Error fetching familles:', error);
        return throwError(() => new Error("Erreur lors du chargement des familles"));
      })
    );
  }

  getIndicateursByFamille(familleId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/indicateurs/famille/${familleId}`).pipe(
      catchError(error => {
        console.error('❌ Error fetching indicateurs:', error);
        return throwError(() => new Error("Erreur lors du chargement des indicateurs"));
      })
    );
  }

  getCompetencesByIndicateur(indicateurId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/competences/indicateur/${indicateurId}`).pipe(
      catchError(error => {
        console.error('❌ Error fetching competences:', error);
        return throwError(() => new Error("Erreur lors du chargement des compétences"));
      })
    );
  }

  addEvaluation(evaluation: any): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/evaluation`, evaluation);
  }

  // Bulk Assign Evaluation
  bulkAssignEvaluation(request: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/evaluation/bulk-evaluate`, request);
  }

  getNiveaux() {
    return this.http.get<string[]>('/api/evaluation/niveaux'); // adapte le path
  }

  getCompetencesByPost(postId : number): Observable<any> {
    return this.http.get(`${this.apiUrl}/postcompetence/${postId}/competences`).pipe(
      catchError(error => {
        console.error('❌ Error fetching competences:', error);
        return throwError(() => new Error("Erreur lors du chargement des competence"));
      })
    );
  }

  getAllPosts(): Observable<any> {
    return this.http.get('/api/posts'); // adapte l’URL selon ton backend
  }

}
