import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AnalyseService {

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
  

getEmployeesByPost(postId: number): Observable<any[]> {
  return this.http.get<any[]>(`/api/employees/byposte/${postId}`);
}

    getallPosts() :Observable<any> {
         return this.http.get(`${this.baseUrl}/posts`).pipe(
        catchError(error => {
          console.error('❌ Error fetching employee:', error);
          return throwError(() => new Error("Erreur lors du chargement des employee"));
        })
      );
    }

        getallservices() :Observable<any> {
         return this.http.get(`${this.baseUrl}/services`).pipe(
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

    getserviceBypost(id: number): Observable<any> {
    return this.http.get<any>(`api/services/by-post/${id}`);
  }
  

  analyseParPeriodeEtPoste(dateDebut: string, dateFin: string, posteId: number) {
  return this.http.get(`/api/evaluation/analyse`, {
    params: {
      dateDebut,
      dateFin,
      posteId
    }
  });
}

   getpostByservice(serviceId : number): Observable<any> {
    return this.http.get(`api/posts/service/${serviceId}`).pipe(
      catchError(error => {
        console.error('❌ Error fetching competences:', error);
        return throwError(() => new Error("Erreur lors du chargement des competence"));
      })
    );
  }

  getAnalyse(dateDebut: string, dateFin: string, posteId: number) {
  const params = new HttpParams()
    .set('dateDebut', dateDebut)
    .set('dateFin', dateFin)
    .set('posteId', posteId.toString());

  return this.http.get<any>('/api/evaluation/analyse', { params });
}

getNombrePostesNonEvalues(dateDebut: string, dateFin: string) {
    const params = new HttpParams()
      .set('dateDebut', dateDebut)
      .set('dateFin', dateFin);
    return this.http.get<number>(`/api/evaluation/postes-non-evalues`, { params });
  }

}
