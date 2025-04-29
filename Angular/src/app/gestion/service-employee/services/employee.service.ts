import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { KeycloakService } from 'src/app/Services/keycloak/keycloak.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private apiUrl = '/api/employees';  // Ensure this matches your backend URL

  
  constructor(private http: HttpClient, private keycloakService: KeycloakService) {}

  getEmployees(): Observable<any> {
    return this.http.get(this.apiUrl).pipe(
      catchError(error => {
        console.error('❌ Error fetching employee:', error);
        return throwError(() => new Error("Erreur lors du chargement des employee"));
      })
    );
  }

  getEmployeeById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  getEmployeeByNom(searchTerm : String): Observable<any> {
    if (!searchTerm.trim()) {
      return this.getEmployees(); // If search is empty, return all employees
    }
    return this.http.get<any>(`${this.apiUrl}/parNom?mc=${searchTerm}`);
  }

  searchEmployeesByPost(searchTerm: string): Observable<any[]> {
    if (!searchTerm.trim()) {
      return this.getEmployees(); // If search is empty, return all employees
    }

    return this.http.get<any[]>(`${this.apiUrl}/byPost?mc=${searchTerm}`);
  }

  exportEmployees(): Observable<Blob> {

    return this.http.get(`${this.apiUrl}/export`, {  responseType: 'blob' }).pipe(
      catchError(error => {
        console.error('❌ Error exporting competences:', error);
        return throwError(() => new Error("Erreur lors de l'export des compétences"));
      })
    );
  }

  }
