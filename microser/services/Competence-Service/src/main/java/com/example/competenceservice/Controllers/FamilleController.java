package com.example.competenceservice.Controllers;


import com.example.competenceservice.Entites.Famille;
import com.example.competenceservice.Services.IServiceFamille;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/familles")

@AllArgsConstructor
public class FamilleController {

    private IServiceFamille serviceFamille;



    @PostMapping
    public void addFamille(@RequestBody Famille famille) {
        serviceFamille.addfamille(famille);
    }

    @GetMapping("/{id}")
    public Famille getFamille(@PathVariable Long id) {
        return serviceFamille.getfamille(id);
    }

    @GetMapping
    public List<Famille> getAllFamilles() {
        return serviceFamille.getAllFamilles();
    }

    @DeleteMapping("/{id}")
    public void deleteFamille(@PathVariable Long id) {
        serviceFamille.deletefamille(id);
    }

    @PutMapping
    public void updateFamille(@RequestBody Famille famille) {
        serviceFamille.updatefamille(famille);
    }
}
