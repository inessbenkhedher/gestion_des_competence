package com.example.evaluation_service.Entities;

import com.example.evaluation_service.DTO.Competence;
import com.example.evaluation_service.DTO.Post;
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
public class PosteCompetence {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long posteId;         // ID du poste (récupéré du service employee)
    private Long competenceId;    // ID de la compétence

    @Enumerated(EnumType.STRING)
    private Niveau_Possible niveauRequis;

    @Transient
    private Post post;
    @Transient
    private Competence competence;

}
