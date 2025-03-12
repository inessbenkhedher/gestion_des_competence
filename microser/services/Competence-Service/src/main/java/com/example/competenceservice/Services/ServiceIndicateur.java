package com.example.competenceservice.Services;

import com.example.competenceservice.Dto.IndicateurDto;
import com.example.competenceservice.Mappers.IndicateurMapper;
import com.example.competenceservice.Services.IServiceIndicateur;
import org.springframework.stereotype.Service;

import com.example.competenceservice.Entites.Indicateur;
import com.example.competenceservice.Repository.IndicateurRepository;
import lombok.AllArgsConstructor;


import java.util.ArrayList;
import java.util.List;


@AllArgsConstructor
@Service
public class ServiceIndicateur implements IServiceIndicateur {

    private IndicateurRepository ir;
    private IndicateurMapper mapper;

    @Override
    public void addindicateur(Indicateur indicateur) {
        ir.save(indicateur);
    }

    @Override
    public Indicateur getindicateur(Long id) {
        return ir.findById(id).get();
    }

    @Override
    public List<IndicateurDto> getAllindicateur() {
        List<Indicateur> list = ir.findAll();
        List<IndicateurDto> dtos = new ArrayList<IndicateurDto>();
        for (Indicateur indicateur : list) {
            dtos.add(mapper.indidtofromindi(indicateur));
        }
        return dtos;
    }

    @Override
    public void deleteindicateur(Long id) {
        ir.deleteById(id);
    }

    @Override
    public void updateindicateur(Indicateur indicateur) {
        ir.save(indicateur);
    }
}
