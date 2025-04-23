package com.example.evaluation_service.DTO;

import lombok.Data;

@Data
public class ProfilCompetenceDto {
    private Long competence_id;
    private String designation;
    private String niveau_actuel;
    private String niveau_requis;
}
