import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {

  private baseUrl = '/api';

  constructor(private http: HttpClient) {}

  getEvaluationsByEmployeeId(employeeId: number) {
    return this.http.get(`${this.baseUrl}/evaluation/employee/${employeeId}/competences`);
  }

  deleteEvaluation(id: number) {
    return this.http.delete(`${this.baseUrl}/evaluation/${id}`);
  }

  getEmployeeById(id: number) {
    return this.http.get(`${this.baseUrl}/employees/${id}`);
  } 

  
  getNiveaux() {
    return this.http.get<string[]>(`${this.baseUrl}/evaluation/niveaux`); // adapte le path
  }
  updateEvaluation(id: number, evaluation: any) {
    return this.http.put(`/api/evaluation/${id}`, evaluation);
  }
}
