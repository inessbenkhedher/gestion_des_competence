package com.example.evaluation_service.service;
import com.example.evaluation_service.DTO.*;
import com.example.evaluation_service.Entities.Evaluation;

import java.util.List;

public interface IServiceEvaluation {
    public void addevaluation(Evaluation evaluation);
    public Evaluation getevaluation(Long id);
    public List<EvaluationDto> getAllevaluation();
    public void deleteevaluation(Long id);
    public void updateevaluation(Long id,Evaluation evaluation);
    public List<CompetenceWithNiveau> getCompetencesByEmployeeId  (Long employeeId);
    public List<Evaluation> createBulkEvaluations(BulkEvaluationReques request);
    List<Evaluation> getEvaluationHistory(Long employeeId, Long competenceId);
    public ProfilEmployeeDto buildProfilForIA(Long employeeId);
}
