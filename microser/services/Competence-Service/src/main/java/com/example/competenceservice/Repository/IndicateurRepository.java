package com.example.competenceservice.Repository;

import com.example.competenceservice.Entites.Indicateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IndicateurRepository extends JpaRepository<Indicateur,Long> {
    List<Indicateur> findByFamilleId(Long familleId);
}
