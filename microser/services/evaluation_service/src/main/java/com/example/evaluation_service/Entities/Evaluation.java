package com.example.evaluation_service.Entities;


import com.example.evaluation_service.DTO.Competence;
import com.example.evaluation_service.DTO.Employee;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
public class Evaluation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Date date;

    private String statut;
    private String commentaire;
    private String nomEvaluator;

    @Enumerated(EnumType.STRING)
    private Niveau_Possible niveau;

    @Transient
    private Employee employee;

    @Transient
    private Competence competence;

    private Long employeeId;
    private Long competenceId;
}
