package com.example.competenceservice.Controllers;


import com.example.competenceservice.Dto.IndicateurDto;
import com.example.competenceservice.Entites.Indicateur;
import com.example.competenceservice.Services.IServiceIndicateur;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/indicateurs")
@AllArgsConstructor
public class IndicateursController {

    private IServiceIndicateur serviceIndicateur;



    @PostMapping
    public void addIndicateur(@RequestBody Indicateur indicateur) {
        serviceIndicateur.addindicateur(indicateur);
    }

    @GetMapping("/{id}")
    public Indicateur getIndicateur(@PathVariable Long id) {
        return serviceIndicateur.getindicateur(id);
    }

    @GetMapping
    public List<IndicateurDto> getAllIndicateurs() {
        return serviceIndicateur.getAllindicateur();
    }

    @DeleteMapping("/{id}")
    public void deleteIndicateur(@PathVariable Long id) {
        serviceIndicateur.deleteindicateur(id);
    }

    @PutMapping
    public void updateIndicateur(@RequestBody Indicateur indicateur) {
        serviceIndicateur.updateindicateur(indicateur);
    }
}
