package com.example.competenceservice.Mappers;


import com.example.competenceservice.Dto.CompetenceDto;
import com.example.competenceservice.Entites.Competence;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

@Service
public class CompetenceMapper {
    public CompetenceDto comptdtofromcomp (Competence p) {
        CompetenceDto cdto = new CompetenceDto();
        BeanUtils.copyProperties(p, cdto);
        return cdto;
    }
}
