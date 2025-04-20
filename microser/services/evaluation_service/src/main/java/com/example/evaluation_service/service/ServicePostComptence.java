package com.example.evaluation_service.service;


import com.example.evaluation_service.DTO.Competence;
import com.example.evaluation_service.Entities.PosteCompetence;
import com.example.evaluation_service.Feign.CompetenceFeignClient;
import com.example.evaluation_service.Feign.EmployeeFeignClient;
import com.example.evaluation_service.Reoisitory.PostCompetenceRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class ServicePostComptence implements IServicePostCompetence{
    private PostCompetenceRepository pcr;
    private EmployeeFeignClient postFeignClient;
    private CompetenceFeignClient competenceFeignClient;

    @Override
    public void add(PosteCompetence pc) {
        pcr.save(pc);

    }

    @Override
    public List<PosteCompetence> getPosteCompetence(Long posteId) {
        List<PosteCompetence> pcs = pcr.findByPosteId(posteId);
        for (PosteCompetence pc : pcs) {
            pc.setPost(postFeignClient.getPostById(pc.getPosteId()));
            pc.setCompetence(competenceFeignClient.getCompetenceById(pc.getCompetenceId()));
        }
        return pcs;
    }

    @Override
    public List<PosteCompetence> getAll() {
        List<PosteCompetence> pcs = pcr.findAll();
        for (PosteCompetence pc : pcs) {
            try {
                pc.setPost(postFeignClient.getPostById(pc.getPosteId()));
            } catch (Exception e) {
                System.err.println("Erreur récupération post id " + pc.getPosteId());
                pc.setPost(null);
            }

            try {
                pc.setCompetence(competenceFeignClient.getCompetenceById(pc.getCompetenceId()));
            } catch (Exception e) {
                System.err.println("Erreur récupération compétence id " + pc.getCompetenceId());
                pc.setCompetence(null);
            }
        }
        return pcs;
    }

    @Override
    public void updatePosteCompetence(Long id, PosteCompetence pc) {
        PosteCompetence existing = pcr.findById(id)
                .orElseThrow(() -> new RuntimeException("PosteCompetence non trouvé"));

        existing.setNiveauRequis(pc.getNiveauRequis());
        existing.setCompetenceId(pc.getCompetenceId());
        existing.setPosteId(pc.getPosteId());

        pcr.save(existing);
    }

    @Override
    public void deleteById(Long id) {
        PosteCompetence existing = pcr.findById(id)
                .orElseThrow(() -> new RuntimeException("PosteCompetence non trouvé"));
        pcr.delete(existing);
    }

    public List<Competence> getCompetencesByPostId(Long posteId) {
        List<PosteCompetence> pcs = pcr.findByPosteId(posteId);
        return pcs.stream()
                .map(pc -> competenceFeignClient.getCompetenceById(pc.getCompetenceId()))
                .toList();
    }
}
