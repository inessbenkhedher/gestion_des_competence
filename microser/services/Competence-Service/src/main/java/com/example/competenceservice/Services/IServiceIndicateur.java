package com.example.competenceservice.Services;

import com.example.competenceservice.Dto.IndicateurDto;
import com.example.competenceservice.Entites.Indicateur;

import java.util.List;

public interface IServiceIndicateur {


    public void addindicateur(Indicateur indicateur);
    public Indicateur getindicateur(Long id);
    public List<Indicateur> getAllindicateur();
    public void deleteindicateur(Long id);
    public void updateIndicateur(Long id, Indicateur incomingIndicateur);
}
