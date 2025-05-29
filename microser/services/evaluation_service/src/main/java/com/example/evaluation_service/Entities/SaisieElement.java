package com.example.evaluation_service.Entities;


import com.example.evaluation_service.DTO.Competence;
import com.example.evaluation_service.DTO.Employee;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
public class SaisieElement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Boolean etat;
    private String codeBarre;
    private Long quantite;
    private String ordreFabricationNumero;
    private String reference;
    private String designation;
    private String codeConception;
    private String operationCode ;
    private String designationComplement;
    private String codeParSection;
    private Double temps;
    private String clientDesignation ;

    @Transient
    private Employee employee;

    @Transient
    private Competence competence;

    private Long employeeId;
    private Long competenceId;
}
