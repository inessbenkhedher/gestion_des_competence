package com.example.competenceservice.Mappers;


import com.example.competenceservice.Dto.IndicateurDto;
import com.example.competenceservice.Entites.Indicateur;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

@Service
public class IndicateurMapper {

    public IndicateurDto indidtofromindi (Indicateur I) {
        IndicateurDto Idto = new IndicateurDto();
        BeanUtils.copyProperties(I, Idto);
        return Idto;
    }

}
