import { HttpClient,HttpErrorResponse,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { KeycloakService } from 'src/app/Services/keycloak/keycloak.service';

@Injectable({
  providedIn: 'root'
})
export class FamilleService {
  private apiUrl = '/api/familles';

  constructor(
    private http: HttpClient,
    private keycloakService: KeycloakService // Injectez le service
  ) {}

  addFamille(data: any): Observable<any> {
    const token = this.keycloakService.token; // Récupérez le token depuis Keycloak
    
    if (!token) {
      return throwError(() => new Error('Utilisateur non authentifié'));
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(this.apiUrl, data, {
      headers: headers,
      withCredentials: true
    }).pipe(
      catchError(error => {
        console.error('Erreur API:', error);
        return throwError(() => new Error('Erreur lors de l\'ajout de la famille'));
      })
    );
  }

  getAllFamilles(): Observable<any> {
    return this.http.get(this.apiUrl).pipe(
      catchError(error => {
        console.error('❌ Error fetching familles:', error);
        return throwError(() => new Error("Erreur lors du chargement des familles"));
      })
    );
  }

  deleteFamille(id: number): Observable<any> {
    const token = this.keycloakService.token;
  
    if (!token) {
      return throwError(() => new Error('Utilisateur non authentifié'));
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    return this.http.delete(`${this.apiUrl}/${id}`, { headers }).pipe(
      catchError(error => {
        console.error('❌ Error deleting famille:', error);
        return throwError(() => new Error("Erreur lors de la suppression de la famille"));
      })
    );
  }

  updateFamille(id: number, data: any): Observable<any> {
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
        console.error('❌ Error updating famille:', error);
        return throwError(() => new Error("Erreur lors de la modification du famille"));
      })
    );
  }
  
  getFamilleById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('❌ Error fetching famille:', error);
        return throwError(() => new Error("Erreur lors de la récupération du famille"));
      })
    );
  }
}
