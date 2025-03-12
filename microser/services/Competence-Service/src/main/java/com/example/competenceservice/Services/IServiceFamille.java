package com.example.competenceservice.Services;

import com.example.competenceservice.Entites.Famille;

import java.util.List;

public interface IServiceFamille {

    public void addfamille(Famille famille);
    public Famille getfamille(Long id);
    public List<Famille> getAllFamilles();
    public void deletefamille(Long id);
    public void updatefamille(Famille famille);
}
