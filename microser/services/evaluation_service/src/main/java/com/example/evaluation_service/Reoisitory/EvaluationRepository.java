package com.example.evaluation_service.Reoisitory;

import com.example.evaluation_service.Entities.Evaluation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EvaluationRepository extends JpaRepository<Evaluation,Long> {

    List<Evaluation> findByEmployeeId(Long employeeId);
    List<Evaluation> findByEmployeeIdAndCompetenceIdOrderByDateDesc(Long employeeId, Long competenceId);

}
