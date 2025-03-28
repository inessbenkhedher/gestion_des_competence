import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { KeycloakService } from 'src/app/Services/keycloak/keycloak.service';

@Injectable({
  providedIn: 'root'
})
export class IndicateurService {

  private apiUrl = '/api/indicateurs';
  private familleUrl = '/api/familles';

  constructor(
    private http: HttpClient,
    private keycloakService: KeycloakService
  ) {}

  getAllIndicateurs(): Observable<any> {
    return this.http.get(this.apiUrl).pipe(
      catchError(error => {
        console.error('❌ Error fetching indicateurs:', error);
        return throwError(() => new Error("Erreur lors du chargement des indicateurs"));
      })
    );
  }

  addIndicateur(data: any): Observable<any> {
    const token = this.keycloakService.token;
    if (!token) {
      return throwError(() => new Error('Utilisateur non authentifié'));
    }
  
  

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(this.apiUrl, data, { headers }).pipe(
      catchError(error => {
        console.error('Erreur API:', error);
        return throwError(() => new Error("Erreur lors de l'ajout de l'indicateur"));
      })
    );
  }


  getFamilles(): Observable<any> {
    return this.http.get(this.familleUrl).pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération des familles:', error);
        return throwError(() => new Error("Erreur lors du chargement des familles"));
      })
    );
  }

  updateIndicateur(id: number, data: any): Observable<any> {
    const token = this.keycloakService.token;
    if (!token) {
      return throwError(() => new Error('Utilisateur non authentifié'));
    }
  
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  
    return this.http.put(`${this.apiUrl}/${id}`, data, { headers }).pipe(
      catchError(error => {
        console.error('❌ Error updating indicateur:', error);
        return throwError(() => new Error("Erreur lors de la modification de l'indicateur"));
      })
    );
  }
  
  getIndicateurById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('❌ Error fetching indicateur:', error);
        return throwError(() => new Error("Erreur lors de la récupération de l'indicateur"));
      })
    );
  }

}
