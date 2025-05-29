package com.example.evaluation_service.Controller;


import com.example.evaluation_service.Entities.SaisieElement;
import com.example.evaluation_service.service.IserviceElement;
import lombok.AllArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/elements")
public class ElementController {

    private IserviceElement service;

    @PostMapping
    public SaisieElement create(@RequestBody SaisieElement element) {
        return service.create(element);
    }

    @PutMapping("/{id}")
    public SaisieElement update(@PathVariable Long id, @RequestBody SaisieElement element) {
        return service.update(id, element);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    @GetMapping("/{id}")
    public SaisieElement getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @GetMapping
    public List<SaisieElement> getAll() {
        return service.getAll();
    }

    @GetMapping("/employee/{employeeId}")
    public List<SaisieElement> getByEmployeeId(@PathVariable Long employeeId) {
        return service.getByEmployeeId(employeeId);
    }
    @PutMapping("/{id}/etat")
    public ResponseEntity<SaisieElement> updateEtat(
            @PathVariable Long id,
            @RequestParam Boolean etat) {
        SaisieElement updated = service.updateEtat(id, etat);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/export/excel")
    public ResponseEntity<byte[]> exportToExcel() throws IOException {
        List<SaisieElement> saisies = service.getAll(); // Ou selon un filtre

        byte[] excelBytes = service.generateExcelFile(saisies);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDisposition(ContentDisposition.attachment().filename("liste_elements.xlsx").build());

        return new ResponseEntity<>(excelBytes, headers, HttpStatus.OK);
    }
}
