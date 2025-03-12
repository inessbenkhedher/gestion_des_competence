package com.example.competenceservice.Services;

import com.example.competenceservice.Dto.CompetenceDto;
import com.example.competenceservice.Entites.Competence;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;

public interface IServiceCompetence {



    public void addcompetence(Competence competence);
    public Competence  getcompetence(Long id);
    public List<CompetenceDto> getAllcompetence();
    public void deletecompetence(Long id);
    public void updatecompetence(Competence competence);
    public void exportCompetencesToExcel(HttpServletResponse response) throws IOException;
}
