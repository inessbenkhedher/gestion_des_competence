package com.example.evaluation_service.service;

import com.example.evaluation_service.DTO.*;
import com.example.evaluation_service.Entities.Evaluation;
import com.example.evaluation_service.Entities.PosteCompetence;
import com.example.evaluation_service.Feign.CompetenceFeignClient;
import com.example.evaluation_service.Feign.EmployeeFeignClient;
import com.example.evaluation_service.Reoisitory.EvaluationRepository;
import com.example.evaluation_service.Reoisitory.PostCompetenceRepository;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.sql.Date;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@AllArgsConstructor
@Service
public class ServiceEvaluation implements IServiceEvaluation {

    private EvaluationRepository er;
    private PostCompetenceRepository posteCompetenceRepository;

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
    public void updateevaluation(Long oldId, Evaluation newEvaluation) {
        Evaluation old = er.findById(oldId)
                .orElseThrow(() -> new RuntimeException("Evaluation Not Found 😡"));

        // Créer une nouvelle instance au lieu de modifier l'existante
        Evaluation newEval = new Evaluation();

        newEval.setNiveau(newEvaluation.getNiveau());
        newEval.setStatut(newEvaluation.getStatut());
        newEval.setDate(newEvaluation.getDate());
        newEval.setNomEvaluator(newEvaluation.getNomEvaluator());
        newEval.setCommentaire(newEvaluation.getCommentaire());

        // Copier les relations
        newEval.setEmployeeId(old.getEmployeeId());
        newEval.setCompetenceId(old.getCompetenceId());

        er.save(newEval); // 💾 Nouvelle ligne ajoutée
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
                            competence.getCode(),
                            evaluation.getCompetenceId(),// Désignation réelle
                            evaluation.getNomEvaluator(),
                            evaluation.getNiveau().toString(),
                            evaluation.getDate(),
                            evaluation.getStatut(),

                            evaluation.getCommentaire()
                    );
                })
                .collect(Collectors.toList());
    }

    public List<Evaluation> createBulkEvaluations(BulkEvaluationReques req) {
        List<Evaluation> evals = new ArrayList<>();
        for (CompetenceLevel cl : req.getCompetenceLevels()) {
            evals.add(Evaluation.builder()
                    .employeeId(req.getEmployeeId())
                    .competenceId(cl.getCompetenceId())
                    .niveau(cl.getNiveau())

                    .commentaire(req.getCommentaire())
                    .nomEvaluator(req.getNomEvaluator())
                    .date(req.getDate())
                    .build());
        }

        return er.saveAll(evals);
    }

    @Override
    public List<Evaluation> getEvaluationHistory(Long employeeId, Long competenceId) {
        return er.findByEmployeeIdAndCompetenceIdOrderByDateDesc(employeeId, competenceId);
    }

    public void exportEvaluationByPost(Long postId, HttpServletResponse response) throws IOException {
        // 🔹 Récupérer les compétences du poste
        List<PosteCompetence> posteCompetences = posteCompetenceRepository.findByPosteId(postId);
        List<Long> competenceIds = posteCompetences.stream().map(PosteCompetence::getCompetenceId).toList();
        List<Competence> competences = competenceIds.stream()
                .map(competenceClient::getCompetenceById)
                .toList();

        // 🔹 Récupérer les employés ayant ce poste
        List<Employee> employees = employeeClient.getAllEmployees().stream()
                .filter(e -> e.getPost() != null && e.getPost().getId().equals(postId))
                .toList();

        // 🔹 Récupérer toutes les évaluations
        List<Evaluation> allEvaluations = er.findAll();

        // 🔹 Création du fichier Excel
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Évaluations");

        // 🔸 En-têtes
        Row header = sheet.createRow(0);
        header.createCell(0).setCellValue("Matricule");
        header.createCell(1).setCellValue("Nom Complet");
        for (int i = 0; i < competences.size(); i++) {
            header.createCell(i + 2).setCellValue(competences.get(i).getCode());
        }

        // 🔸 Remplir lignes
        int rowIndex = 1;
        for (Employee emp : employees) {
            Row row = sheet.createRow(rowIndex++);
            row.createCell(0).setCellValue(emp.getMatricule());
            row.createCell(1).setCellValue(emp.getNom() + " " + emp.getPrenom());

            for (int i = 0; i < competences.size(); i++) {
                Long compId = competences.get(i).getId();

                // Chercher évaluation de cet employé pour cette compétence
                Evaluation eval = allEvaluations.stream()
                        .filter(e -> e.getEmployeeId().equals(emp.getId()) && e.getCompetenceId().equals(compId))
                        .findFirst()
                        .orElse(null);

                row.createCell(i + 2).setCellValue(eval != null ? eval.getNiveau().toString() : "❌");
            }
        }

        for (int i = 0; i < competences.size() + 2; i++) {
            sheet.autoSizeColumn(i);
        }

        // 🔹 Config HTTP response
        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setHeader("Content-Disposition", "attachment; filename=evaluations_post_" + postId + ".xlsx");
        workbook.write(response.getOutputStream());
        workbook.close();
    }


    public ProfilEmployeeDto buildProfilForIA(Long employeeId) {
        Employee employee = employeeClient.getEmployeeById(employeeId);
        Long posteId = employee.getPost().getId();

        List<Evaluation> evaluations = er.findByEmployeeId(employeeId);
        List<PosteCompetence> posteCompetences = posteCompetenceRepository.findByPosteId(posteId);

        Map<Long, ProfilCompetenceDto> competenceMap = new HashMap<>();

        for (Evaluation e : evaluations) {
            PosteCompetence pc = posteCompetences.stream()
                    .filter(p -> p.getCompetenceId().equals(e.getCompetenceId()))
                    .findFirst()
                    .orElse(null);

            if (pc != null) {
                ProfilCompetenceDto existing = competenceMap.get(e.getCompetenceId());

                if (existing == null || isHigherLevel(e.getNiveau().toString(), existing.getNiveau_actuel())) {
                    ProfilCompetenceDto dto = new ProfilCompetenceDto();
                    dto.setCompetence_id(e.getCompetenceId());
                    dto.setDesignation(competenceClient.getCompetenceById(e.getCompetenceId()).getDesignation());
                    dto.setNiveau_actuel(e.getNiveau().toString());
                    dto.setNiveau_requis(
                            pc.getNiveauRequis() != null ? pc.getNiveauRequis().toString() : "NON_DEFINI"
                    );

                    competenceMap.put(e.getCompetenceId(), dto);
                }
            }
        }

        ProfilEmployeeDto result = new ProfilEmployeeDto();
        result.setEmployee_id(employeeId);
        result.setPoste_id(posteId);
        result.setCompetences(new ArrayList<>(competenceMap.values()));

        // 🆕 Ajout du flag "aucune évaluation"
        result.setHasNoEvaluations(evaluations == null || evaluations.isEmpty());

        return result;
    }


    private boolean isHigherLevel(String newLevel, String currentLevel) {
        List<String> levels = List.of("DEBUTANT", "INTERMEDIAIRE", "AVANCE", "EXPERT");
        return levels.indexOf(newLevel) > levels.indexOf(currentLevel);
    }








}
