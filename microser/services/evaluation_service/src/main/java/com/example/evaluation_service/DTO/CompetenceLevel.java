package com.example.evaluation_service.DTO;

import com.example.evaluation_service.Entities.Niveau_Possible;
import lombok.Data;

@Data
public class CompetenceLevel {
    private Long competenceId;
    private Niveau_Possible niveau;
}
