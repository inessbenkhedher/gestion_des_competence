import { HttpClient ,HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { KeycloakService } from 'src/app/Services/keycloak/keycloak.service';

@Injectable({
  providedIn: 'root'
})
export class CompetanceService {

  private apiUrl = '/api/competences';
  private indicateurUrl = '/api/indicateurs';
  

  constructor(private http: HttpClient,
     private keycloakService: KeycloakService) {}

     getIndicateurs(): Observable<any> {
      return this.http.get(this.indicateurUrl).pipe(
        catchError(error => {
          console.error('Erreur lors de la récupération des familles:', error);
          return throwError(() => new Error("Erreur lors du chargement des familles"));
        })
      );
    }

  getAllCompetences(): Observable<any> {
    return this.http.get(this.apiUrl).pipe(
      catchError(error => {
        console.error('❌ Error fetching competences:', error);
        return throwError(() => new Error("Erreur lors du chargement des compétences"));
      })
    );
  }


  getCompetenceById(id: number): Observable<any> {
    const token = this.keycloakService.token;
    if (!token) {
      return throwError(() => new Error('Utilisateur non authentifié'));
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(`${this.apiUrl}/${id}`, { headers }).pipe(
      catchError(error => {
        console.error('❌ Error fetching competence:', error);
        return throwError(() => new Error("Erreur lors de la récupération de la compétence"));
      })
    );
  }

  addCompetence(data: any): Observable<any> {
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
        console.error('❌ Error adding competence:', error);
        return throwError(() => new Error("Erreur lors de l'ajout de la compétence"));
      })
    );
  }

  updateCompetence(id: number, data: any): Observable<any> {
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
        console.error('❌ Error updating competence:', error);
        return throwError(() => new Error("Erreur lors de la mise à jour de la compétence"));
      })
    );
  }

  deleteCompetence(id: number): Observable<any> {
    if (!id) {
        return throwError(() => new Error('ID de compétence invalide'));
    }

    const token = this.keycloakService.token;
      
    if (!token) {
        return throwError(() => new Error('Utilisateur non authentifié'));
    }
      
    const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    });
      
    return this.http.delete(`${this.apiUrl}/${id}`, { headers }).pipe(
        catchError(error => {
            console.error('❌ Error deleting competence:', error);
            return throwError(() => new Error(error.error?.message || "Erreur lors de la suppression"));
        })
    );
}

exportCompetences(): Observable<Blob> {
  const token = this.keycloakService.token;
  if (!token) {
    return throwError(() => new Error('Utilisateur non authentifié'));
  }

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });

  return this.http.get(`${this.apiUrl}/export`, { headers, responseType: 'blob' }).pipe(
    catchError(error => {
      console.error('❌ Error exporting competences:', error);
      return throwError(() => new Error("Erreur lors de l'export des compétences"));
    })
  );
}


}