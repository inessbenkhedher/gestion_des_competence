package com.example.evaluation_service.Controller;


import com.example.evaluation_service.DTO.BulkEvaluationReques;
import com.example.evaluation_service.DTO.Competence;
import com.example.evaluation_service.DTO.CompetenceWithNiveau;
import com.example.evaluation_service.DTO.EvaluationDto;
import com.example.evaluation_service.Entities.Evaluation;
import com.example.evaluation_service.Entities.Niveau_Possible;
import com.example.evaluation_service.service.IServiceEvaluation;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/evaluation")
public class EvaluationController {
    private IServiceEvaluation serviceEvaluation;

    @PostMapping
    public void addEvaluation(@RequestBody Evaluation evaluation) {
        serviceEvaluation.addevaluation(evaluation);
    }

    @GetMapping("/{id}")
    public Evaluation getEvaluation(@PathVariable Long id) {
        return serviceEvaluation.getevaluation(id);
    }

    @GetMapping
    public List<EvaluationDto> getAllEvaluations() {
        return serviceEvaluation.getAllevaluation();
    }

    @DeleteMapping("/{id}")
    public void deleteEvaluation(@PathVariable Long id) {
        serviceEvaluation.deleteevaluation(id);
    }

    @PutMapping("/{id}")
    public void updateEvaluation(@PathVariable Long id,@RequestBody Evaluation evaluation) {
        serviceEvaluation.updateevaluation(id,evaluation);
    }

    @GetMapping("/employee/{employeeId}/competences")
    public List<CompetenceWithNiveau> getCompetencesByEmployee(@PathVariable Long employeeId) {
        return serviceEvaluation.getCompetencesByEmployeeId(employeeId);
    }

    @PostMapping("/bulk-assign")
    public ResponseEntity<List<Evaluation>> assignCompetenceToEmployees(@RequestBody BulkEvaluationReques request) {
        List<Evaluation> evaluations = serviceEvaluation.createBulkEvaluations(request);
        return ResponseEntity.ok(evaluations);
    }

    @GetMapping("/niveaux")
    public Niveau_Possible[] getNiveaux() {
        return Niveau_Possible.values();
    }

    @GetMapping("/history/{employeeId}/{competenceId}")
    public List<Evaluation> getEvaluationHistory(@PathVariable Long employeeId, @PathVariable Long competenceId) {
        return serviceEvaluation.getEvaluationHistory(employeeId, competenceId);
    }
}
