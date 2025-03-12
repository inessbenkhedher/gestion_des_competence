package com.example.competenceservice.Controllers;


import com.example.competenceservice.Dto.CompetenceDto;
import com.example.competenceservice.Entites.Competence;
import com.example.competenceservice.Services.IServiceCompetence;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/competences")
@AllArgsConstructor
public class CompetenceController {

    private IServiceCompetence serviceCompetence;

    @PostMapping
    public void addCompetence(@RequestBody Competence competence) {
        serviceCompetence.addcompetence(competence);
    }

    @GetMapping("/{id}")
    public Competence getCompetence(@PathVariable Long id) {
        return serviceCompetence.getcompetence(id);
    }

    @GetMapping
    public List<CompetenceDto> getAllCompetences() {
        return serviceCompetence.getAllcompetence();
    }

    @DeleteMapping("/{id}")
    public void deleteCompetence(@PathVariable Long id) {
        serviceCompetence.deletecompetence(id);
    }

    @PutMapping
    public void updateCompetence(@RequestBody Competence competence) {
        serviceCompetence.updatecompetence(competence);
    }

    @GetMapping("/export")
    public void exportCompetences(HttpServletResponse response) throws IOException {
        serviceCompetence.exportCompetencesToExcel(response);
    }
}
