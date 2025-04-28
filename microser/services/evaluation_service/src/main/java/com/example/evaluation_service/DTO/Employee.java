package com.example.evaluation_service.DTO;

import lombok.Data;

@Data
public class Employee {
    private Long id;
    private String matricule;
    private String nom;
    private String prenom;
    private Post post;

}
