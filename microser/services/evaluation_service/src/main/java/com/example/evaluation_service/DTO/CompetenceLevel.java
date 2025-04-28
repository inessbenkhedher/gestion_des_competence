package com.example.evaluation_service.DTO;

import com.example.evaluation_service.Entities.Niveau_Possible;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CompetenceLevel {
    private Long competenceId;
    private Niveau_Possible niveau;
}
