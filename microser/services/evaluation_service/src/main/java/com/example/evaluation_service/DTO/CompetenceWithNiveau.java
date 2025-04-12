package com.example.evaluation_service.DTO;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CompetenceWithNiveau {

    private Long id;
    private String designation;
    private String nomEvaluator;
    private String niveau;
     private Date date;
     private String statut;
     private String commentaire;
}
