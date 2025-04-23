package com.example.evaluation_service.DTO;


import com.example.evaluation_service.Entities.Niveau_Possible;
import lombok.Data;

import java.sql.Date;
import java.util.List;

@Data
public class BulkEvaluationReques {

    private Long employeeId;  // Liste des employés sélectionnés
    private List<CompetenceLevel> competenceLevels;      // Compétence affectée
    private String commentaire;
    private String nomEvaluator;// Commentaire global
    private Niveau_Possible niveau;  // Niveau attribué
    private Date date;
}
