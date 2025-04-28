package com.example.employeservice.Entites;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String matricule;

    private String nom;
    private String prenom;
    private Integer telephone;
    private String email;
    private String adresse;
    private Date dateNaissance;
    private Date dateEmbauche;


    @ManyToOne
    private Post post;

}
