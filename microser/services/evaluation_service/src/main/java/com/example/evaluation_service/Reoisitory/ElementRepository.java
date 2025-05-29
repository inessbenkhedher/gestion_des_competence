package com.example.evaluation_service.Reoisitory;

import com.example.evaluation_service.Entities.Evaluation;
import com.example.evaluation_service.Entities.SaisieElement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ElementRepository extends JpaRepository<SaisieElement,Long> {
    List<SaisieElement> findByEmployeeId(Long employeeId);
}
