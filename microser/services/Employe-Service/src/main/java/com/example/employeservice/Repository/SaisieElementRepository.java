package com.example.employeservice.Repository;

import com.example.employeservice.Entites.SaisieElementEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SaisieElementRepository extends JpaRepository<SaisieElementEntity, Long> {}