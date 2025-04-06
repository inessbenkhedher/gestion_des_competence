package com.example.employeservice.Dto;

import com.example.employeservice.Entites.Post;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor

@Builder
public class employeedto {

    private Long id;
    private String matricule;
    private String nom;
    private String prenom;
    private Date dateEmbauche;
    private Post post;

}
