import { Injectable } from '@angular/core';
import { EvaluationService } from './evaluation.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeStatusService {
constructor(private evaluationService: EvaluationService) {}

  async getEmployeeStatus(employeeId: number): Promise<'rouge' | 'orange' | 'vert'> {
    try {
      const profil = await this.evaluationService.getProfilIA(employeeId).toPromise();
      const niveaux = ["DEBUTANT", "INTERMEDIAIRE", "AVANCE", "EXPERT"];
      const niveauIndex = (niveau: string) => niveaux.indexOf(niveau);
  
      if (!profil.competences || profil.competences.length === 0) {
        return "rouge";
      }

      const hasGap = profil.competences.some((c: any) =>
        niveauIndex(c.niveau_requis) - niveauIndex(c.niveau_actuel) >= 2
      );
  
      const allRequired = await this.evaluationService.getCompetencesByPost(profil.poste_id).toPromise();
      const evalueesIds = profil.competences.map((c: any) => c.competence_id);
      const nonEvaluees = allRequired.filter((c: any) => !evalueesIds.includes(c.id));
  
      if (hasGap || nonEvaluees.length > 0) {
        return "orange";
      }

      if (profil.hasNoEvaluations) {
        return "rouge";
      }

      return "vert";
    } catch (error) {
      console.error("Erreur IA", error);
      return "rouge";
    }
  }
}
