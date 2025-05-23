package com.example.evaluation_service.Controller;


import com.example.evaluation_service.DTO.*;
import com.example.evaluation_service.Entities.Evaluation;
import com.example.evaluation_service.Entities.Niveau_Possible;
import com.example.evaluation_service.service.IServiceEvaluation;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.sql.Date;
import java.time.LocalDate;
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
    public void updateEvaluation(@PathVariable Long id, @RequestBody Evaluation evaluation) {
        serviceEvaluation.updateevaluation(id, evaluation);
    }

    @GetMapping("/employee/{employeeId}/competences")
    public List<CompetenceWithNiveau> getCompetencesByEmployee(@PathVariable Long employeeId) {
        return serviceEvaluation.getCompetencesByEmployeeId(employeeId);
    }

    @PostMapping("/bulk-evaluate")
    public ResponseEntity<List<Evaluation>> bulkEvaluate(
            @RequestBody BulkEvaluationReques request) {
        List<Evaluation> created = serviceEvaluation.createBulkEvaluations(request);
        return ResponseEntity.ok(created);
    }

    @GetMapping("/niveaux")
    public Niveau_Possible[] getNiveaux() {
        return Niveau_Possible.values();
    }

    @GetMapping("/history/{employeeId}/{competenceId}")
    public List<Evaluation> getEvaluationHistory(@PathVariable Long employeeId, @PathVariable Long competenceId) {
        return serviceEvaluation.getEvaluationHistory(employeeId, competenceId);
    }

    @GetMapping("/profil-ia/{employeeId}")
    public ProfilEmployeeDto getProfilForIA(@PathVariable Long employeeId) {
        return serviceEvaluation.buildProfilForIA(employeeId);
    }

    @GetMapping("/export/{postId}")
    public void exportEvaluationByPost(@PathVariable Long postId, HttpServletResponse response) throws IOException {
        serviceEvaluation.exportEvaluationByPost(postId, response);
    }

    @GetMapping("/analyse")
    public AnalyseResultDto analyse(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate dateDebut,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate dateFin,
            @RequestParam Long posteId
    ) {
        // Convertir en java.sql.Date (si nécessaire pour la méthode service)
        Date sqlDateDebut = Date.valueOf(dateDebut);
        Date sqlDateFin = Date.valueOf(dateFin);
        return serviceEvaluation.analyseEvaluationParPosteEtPeriode(sqlDateDebut, sqlDateFin, posteId);
    }


    @GetMapping("/postes-non-evalues")
    public ResponseEntity<Integer> getNombrePostesNonEvalues(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd")  LocalDate dateDebut,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd")  LocalDate dateFin) {

        Date sqlDateDebut = Date.valueOf(dateDebut);
        Date sqlDateFin = Date.valueOf(dateFin);
        int nombrePostesNonEvalues = serviceEvaluation.countPostesNonEvalues(sqlDateDebut, sqlDateFin);
        return ResponseEntity.ok(nombrePostesNonEvalues);
    }
}
