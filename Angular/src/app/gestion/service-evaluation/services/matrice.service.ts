import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { KeycloakService } from 'src/app/Services/keycloak/keycloak.service';

@Injectable({
  providedIn: 'root'
})
export class MatriceService {
  private apiUrl = '/api';

  constructor(private http: HttpClient,
      private keycloakService: KeycloakService ) { }

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

        
  searchEmployeesByPost(searchTerm: string): Observable<any[]> {
    if (!searchTerm.trim()) {
      return this.getEmployees(); // If search is empty, return all employees
    }

    return this.http.get<any[]>(`${this.apiUrl}/employees/byPost?mc=${searchTerm}`);
  }

  
  getEmployees(): Observable<any> {
    return this.http.get(`${this.apiUrl}/employees`).pipe(
      catchError(error => {
        console.error('❌ Error fetching employee:', error);
        return throwError(() => new Error("Erreur lors du chargement des employee"));
      })
    );

  }

  getAllEvaluations(): Observable<any> {
    return this.http.get(`${this.apiUrl}/evaluation`).pipe(
      catchError(error => {
        console.error('❌ Error fetching evaluation:', error);
        return throwError(() => new Error("Erreur lors du chargement des evaluation"));
      })
    );
  }
  getAllPosts(): Observable<any[]> {
    return this.http.get<any[]>('/api/posts'); // change if needed
  }

  exportExcelByPost(postId: number) {
    const token = this.keycloakService.token;
    if (!token) {
      return throwError(() => new Error('Utilisateur non authentifié'));
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    return this.http.get(`/api/evaluation/export/${postId}`, { headers, responseType: 'blob' }).pipe(
      catchError(error => {
        console.error('❌ Error exporting competences:', error);
        return throwError(() => new Error("Erreur lors de l'export des compétences"));
      })
    );
  }
}
