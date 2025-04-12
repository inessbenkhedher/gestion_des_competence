package com.example.evaluation_service.service;

import com.example.evaluation_service.DTO.*;
import com.example.evaluation_service.Entities.Evaluation;
import com.example.evaluation_service.Feign.CompetenceFeignClient;
import com.example.evaluation_service.Feign.EmployeeFeignClient;
import com.example.evaluation_service.Reoisitory.EvaluationRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;


@AllArgsConstructor
@Service
public class ServiceEvaluation implements IServiceEvaluation {

    private EvaluationRepository er;

    private EmployeeFeignClient employeeClient; // Feign Client for Employee
    private CompetenceFeignClient competenceClient;
    private evaluationmapper emapper;

    @Override
    public void addevaluation(Evaluation evaluation) {
        Employee employee = employeeClient.getEmployeeById(evaluation.getEmployeeId());
        Competence competence = competenceClient.getCompetenceById(evaluation.getCompetenceId());

        if (employee == null) {
            throw new RuntimeException("Employee Not Found 😡");
        }

        if (competence == null) {
            throw new RuntimeException("Competence Not Found 😡");
        }

        evaluation.setEmployee(employee);
        evaluation.setCompetence(competence);
        er.save(evaluation);
    }


    @Override
    public Evaluation getevaluation(Long id) {
        Evaluation evaluation = er.findById(id)
                .orElseThrow(() -> new RuntimeException("Evaluation Not Found 😡"));


        // Fetch Employee & Competence
        Employee employee = employeeClient.getEmployeeById(evaluation.getEmployeeId());
        Competence competence = competenceClient.getCompetenceById(evaluation.getCompetenceId());

        evaluation.setEmployee(employee);
        evaluation.setCompetence(competence);


        return evaluation;
    }

    @Override
    public List<EvaluationDto> getAllevaluation() {

            List<Evaluation> evaluations = er.findAll();
            List<EvaluationDto> evadtos = new ArrayList<>();

            for (Evaluation evaluation : evaluations) {
                Employee employee = employeeClient.getEmployeeById(evaluation.getEmployeeId());
                Competence competence = competenceClient.getCompetenceById(evaluation.getCompetenceId());

                // Map Employee to EmployeeDto
                Employee employeeDto = new Employee();
                BeanUtils.copyProperties(employee, employeeDto);

                // Map Competence to CompetenceDto
                Competence competenceDto = new Competence();
                BeanUtils.copyProperties(competence, competenceDto);

                // Convert Evaluation to EvaluationDto
                EvaluationDto evaluationDto = emapper.mapToEvaluationDto(evaluation, employeeDto, competenceDto);
                evadtos.add(evaluationDto);
            }

            return evadtos;
    }

    @Override
    public void deleteevaluation(Long id) {
        Evaluation evaluation = er.findById(id)
                .orElseThrow(() -> new RuntimeException("Evaluation Not Found 😡"));

        er.delete(evaluation);

    }

    @Override
    public void updateevaluation(Long id, Evaluation evaluation) {

        Evaluation existingEvaluation = er.findById(id)
                .orElseThrow(() -> new RuntimeException("Evaluation Not Found 😡"));

        existingEvaluation.setNiveau(evaluation.getNiveau());
        existingEvaluation.setStatut(evaluation.getStatut());
        existingEvaluation.setDate(evaluation.getDate());
        existingEvaluation.setNomEvaluator(evaluation.getNomEvaluator());
        existingEvaluation.setCommentaire(evaluation.getCommentaire());

        er.save(existingEvaluation);

    }

    public List<CompetenceWithNiveau> getCompetencesByEmployeeId(Long employeeId) {
        List<Evaluation> evaluations = er.findByEmployeeId(employeeId);

        return evaluations.stream()
                .map(evaluation -> {
                    // Récupérer la compétence réelle depuis le microservice
                    Competence competence = competenceClient.getCompetenceById(evaluation.getCompetenceId());

                    // Créer une nouvelle réponse avec la désignation et le niveau
                    return new CompetenceWithNiveau(
                            evaluation.getId(),
                            competence.getDesignation(), // Désignation réelle
                            evaluation.getNomEvaluator(),
                            evaluation.getNiveau().toString(),
                            evaluation.getDate(),
                            evaluation.getStatut(),

                            evaluation.getCommentaire()
                    );
                })
                .collect(Collectors.toList());
    }

    public List<Evaluation> createBulkEvaluations(BulkEvaluationReques request) {
        // Créer une évaluation pour chaque employé
        List<Evaluation> evaluations = request.getEmployeeIds().stream().map(employeeId ->
                Evaluation.builder()
                        .date(request.getDate())
                        .statut(request.getStatut())
                        .commentaire(request.getCommentaire())
                        .niveau(request.getNiveau())
                        .nomEvaluator(request.getNomEvaluator())
                        .competenceId(request.getCompetenceId())
                        .employeeId(employeeId)
                        .build()
        ).collect(Collectors.toList());

        // Sauvegarde en masse
        return er.saveAll(evaluations);
    }
}
