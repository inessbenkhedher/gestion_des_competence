package com.example.evaluation_service.DTO;

import com.example.competenceservice.Dto.CompetenceDto;
import com.example.evaluation_service.Entities.Niveau_Possible;
import lombok.Data;

import java.util.Date;

@Data
public class EvaluationDto {

    private Date date;

    private String statut;
    private String commentaire;
    private Niveau_Possible niveau;
    private Employee employee;
    private Competence competence;

}
