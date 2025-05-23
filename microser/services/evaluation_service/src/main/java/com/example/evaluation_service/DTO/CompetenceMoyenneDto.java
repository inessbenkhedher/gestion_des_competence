package com.example.evaluation_service.DTO;


import lombok.Data;

@Data
public class CompetenceMoyenneDto {
    private Long competenceId;
    private String code;
    private double moyenne;
}
