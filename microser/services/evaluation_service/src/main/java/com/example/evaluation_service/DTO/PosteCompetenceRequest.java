package com.example.evaluation_service.DTO;

import lombok.Data;

import java.util.List;

@Data
public class PosteCompetenceRequest {

    private Long posteId;
    private List<CompetenceLevel> competences;
}
