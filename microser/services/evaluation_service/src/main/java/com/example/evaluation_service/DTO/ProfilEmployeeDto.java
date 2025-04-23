package com.example.evaluation_service.DTO;

import lombok.Data;

import java.util.List;

@Data
public class ProfilEmployeeDto {
    private Long employee_id;
    private Long poste_id;
    private List<ProfilCompetenceDto> competences;
}
