package com.example.competenceservice.Repository;

import com.example.competenceservice.Entites.Famille;
import com.example.competenceservice.Entites.Indicateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


public interface FamilleRepository extends JpaRepository<Famille,Long> {
}
