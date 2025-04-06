package com.example.competenceservice.Services;

import com.example.competenceservice.Dto.IndicateurDto;
import com.example.competenceservice.Entites.Famille;
import com.example.competenceservice.Mappers.IndicateurMapper;
import com.example.competenceservice.Repository.FamilleRepository;
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
    private FamilleRepository fr;

    @Override
    public void addindicateur(Indicateur indicateur) {
        ir.save(indicateur);
    }

    @Override
    public Indicateur getindicateur(Long id) {
        return ir.findById(id).get();
    }

    @Override
    public List<Indicateur> getAllindicateur() {
        return ir.findAll();
    }

    @Override
    public void deleteindicateur(Long id) {
        ir.deleteById(id);
    }

    public void updateIndicateur(Long id, Indicateur updates) {
        Indicateur existing = ir.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Indicateur non trouvé"));

        if (updates.getTitle() != null && !updates.getTitle().isEmpty()) {
            existing.setTitle(updates.getTitle());
        }
        if (updates.getDescription() != null && !updates.getDescription().isEmpty()) {
            existing.setDescription(updates.getDescription());
        }
        // ✅ Mettre à jour la famille si différente
        if (updates.getFamille() != null &&
                (existing.getFamille() == null || !existing.getFamille().getId().equals(updates.getFamille().getId()))) {

            Famille newFamille = fr.findById(updates.getFamille().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Famille non trouvée"));

            existing.setFamille(newFamille);
        }

        ir.save(existing);
    }

    @Override
    public List<Indicateur> getIndicateursByFamilleId(Long familleId) {
        return ir.findByFamilleId(familleId);
    }
}
