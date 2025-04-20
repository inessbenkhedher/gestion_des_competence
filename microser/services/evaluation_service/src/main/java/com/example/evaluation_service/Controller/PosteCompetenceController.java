package com.example.evaluation_service.Controller;


import com.example.evaluation_service.DTO.Competence;
import com.example.evaluation_service.Entities.PosteCompetence;
import com.example.evaluation_service.service.IServicePostCompetence;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/postcompetence")
public class PosteCompetenceController {

    private IServicePostCompetence service;

    @PostMapping
    public void create(@RequestBody PosteCompetence pc) {
        service.add(pc);
    }

    @GetMapping("/{posteId}")
    public List<PosteCompetence> getByPoste(@PathVariable Long posteId) {
        return service.getPosteCompetence(posteId);
    }

    @GetMapping
    public List<PosteCompetence> getAll() {
        return service.getAll();
    }
    @GetMapping("/{posteId}/competences")
    public List<Competence> getCompetencesByPost(@PathVariable Long posteId) {
        return service.getCompetencesByPostId(posteId);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePosteCompetence(@PathVariable Long id) {
        try {
            service.deleteById(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("PosteCompetence non trouvé");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePosteCompetence(@PathVariable Long id, @RequestBody PosteCompetence posteCompetence) {
        try {
            service.updatePosteCompetence(id, posteCompetence);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur lors de la mise à jour");
        }
    }
}
