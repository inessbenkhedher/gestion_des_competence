package com.example.competenceservice.Dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

@Builder
public class CompetenceDto {

    private String code;
    private String designation;
    private String observatin;
}
