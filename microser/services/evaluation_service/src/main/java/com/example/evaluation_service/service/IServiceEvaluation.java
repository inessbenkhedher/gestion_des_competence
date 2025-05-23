package com.example.evaluation_service.service;
import com.example.evaluation_service.DTO.*;
import com.example.evaluation_service.Entities.Evaluation;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.sql.Date;
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
    public void exportEvaluationByPost(Long postId, HttpServletResponse response) throws IOException;
    public AnalyseResultDto analyseEvaluationParPosteEtPeriode(Date dateDebut, Date dateFin, Long posteId);
    public int countPostesNonEvalues(Date dateDebut, Date dateFin);
}
