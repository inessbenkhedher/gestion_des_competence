package com.example.evaluation_service.DTO;


import com.example.evaluation_service.Entities.Niveau_Possible;
import lombok.Data;

import java.sql.Date;
import java.util.List;

@Data
public class BulkEvaluationReques {

    private List<Long> employeeIds;  // Liste des employés sélectionnés
    private Long competenceId;       // Compétence affectée
    private String statut;           // Statut de l'évaluation (ex: "En Cours", "Validée")
    private String commentaire;      // Commentaire global
    private Niveau_Possible niveau;  // Niveau attribué
    private Date date;
}
