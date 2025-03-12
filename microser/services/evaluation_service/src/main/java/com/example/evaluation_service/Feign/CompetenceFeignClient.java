package com.example.evaluation_service.Feign;


import com.example.evaluation_service.DTO.Competence;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "competence-service")
public interface CompetenceFeignClient {

    @GetMapping("/competences/{id}")
    Competence getCompetenceById(@PathVariable Long id);
}
