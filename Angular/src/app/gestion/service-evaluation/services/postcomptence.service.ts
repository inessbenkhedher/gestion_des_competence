import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PostcomptenceService {

  private baseUrl = '/api/postcompetence';
  private apiUrl = '/api';

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<any[]>(`${this.baseUrl}`);
  }

  getByPostId(postId: number) {
    return this.http.get<any[]>(`${this.baseUrl}/${postId}`);
  }

  add(postCompetence: any) {
    return this.http.post(`${this.baseUrl}`, postCompetence);
  }

  update(id: number, postCompetence: any) {
    return this.http.put(`${this.baseUrl}/${id}`, postCompetence);
  }

  delete(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

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
    
    getAllPostes(): Observable<any> {
      return this.http.get(`${this.apiUrl}/posts`).pipe(
        catchError(error => {
          console.error('❌ Erreur lors du chargement des postes', error);
          return throwError(() => new Error("Erreur chargement postes"));
        })
      );
    }

    getNiveaux() {
      return this.http.get<string[]>(`${this.apiUrl}/evaluation/niveaux`); // adapte le path
    }
  
}
