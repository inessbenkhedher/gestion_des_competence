package com.example.evaluation_service.service;

import com.example.evaluation_service.DTO.Competence;
import com.example.evaluation_service.DTO.EvaluationDto;
import com.example.evaluation_service.Entities.Evaluation;
import com.example.evaluation_service.Entities.PosteCompetence;

import java.util.List;

public interface IServicePostCompetence {
    public void add(PosteCompetence pc);
    public List<PosteCompetence> getPosteCompetence(Long id);
    public List<PosteCompetence> getAll();
    public void updatePosteCompetence(Long id,PosteCompetence pc);
    List<Competence> getCompetencesByPostId(Long posteId);
    public void deleteById(Long id);
}
