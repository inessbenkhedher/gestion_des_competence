package com.example.evaluation_service.service;

import com.example.evaluation_service.Entities.SaisieElement;

import java.io.IOException;
import java.util.List;

public interface IserviceElement {

    SaisieElement create(SaisieElement element);
    SaisieElement update(Long id, SaisieElement element);
    void delete(Long id);
    SaisieElement getById(Long id);
    List<SaisieElement> getAll();
    List<SaisieElement> getByEmployeeId(Long employeeId);
    public SaisieElement updateEtat(Long id, Boolean etat);
    public byte[] generateExcelFile(List<SaisieElement> saisies) throws IOException;
}
