package com.example.competenceservice.Services;

import com.example.competenceservice.Entites.Famille;
import com.example.competenceservice.Entites.Indicateur;
import com.example.competenceservice.Repository.FamilleRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@AllArgsConstructor
@Service
public class ServiceFamille implements IServiceFamille {


    private FamilleRepository fr;



    @Override
    public void addfamille(Famille famille) {
        fr.save(famille);

    }

    @Override
    public Famille getfamille(Long id) {
        return fr.findById(id).get();
    }

    @Override
    public List<Famille> getAllFamilles() {
        return fr.findAll();
    }

    @Override
    public void deletefamille(Long id) {
        fr.deleteById(id);
    }

    @Override
    public void updatefamille(Long id,Famille famille) {
        Famille existing = fr.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Famille non trouvé"));

        if (famille.getTitle() != null && !famille.getTitle().isEmpty()) {
            existing.setTitle(famille.getTitle());
        }
        if (famille.getDescription() != null && !famille.getDescription().isEmpty()) {
            existing.setDescription(famille.getDescription());
        }

        fr.save(existing);
    }
}
