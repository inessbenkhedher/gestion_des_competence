package com.example.employeservice.Controllers;


import com.example.employeservice.Entites.SaisieElementEntity;
import com.example.employeservice.Repository.SaisieElementRepository;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/saisies")
@AllArgsConstructor
public class SaisieElementController {

    private SaisieElementRepository saisieElementRepository;

    @GetMapping
    public List<SaisieElementEntity> getAllSaisies() {
        return saisieElementRepository.findAll();
    }
}
