package com.example.evaluation_service.Reoisitory;

import com.example.evaluation_service.Entities.PosteCompetence;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostCompetenceRepository extends JpaRepository<PosteCompetence, Long> {
    List<PosteCompetence> findByPosteId(Long posteId);
}
