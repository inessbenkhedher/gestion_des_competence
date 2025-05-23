package com.example.evaluation_service.DTO;


import lombok.Data;

import java.util.List;

@Data
public class AnalyseResultDto {
    private List<Employee> employeesNonEvalues;
    private List<Competence> competencesNonEvaluees;
    private List<EvaluationDto> evaluationsFaibles;
    private List<CompetenceMoyenneDto> competencesMoyenneFaible;
}
