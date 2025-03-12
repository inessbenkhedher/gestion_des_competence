package com.example.evaluation_service.DTO;

import com.example.evaluation_service.Entities.Evaluation;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

@Service
public class evaluationmapper {

    public EvaluationDto mapToEvaluationDto(Evaluation e, Employee employeeDto, Competence competenceDto) {
        EvaluationDto edto = new EvaluationDto();
        BeanUtils.copyProperties(e, edto);
        edto.setEmployee(employeeDto);
        edto.setCompetence(competenceDto);
        return edto;
    }
}
