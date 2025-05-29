package com.example.evaluation_service.service;

import com.example.evaluation_service.Entities.SaisieElement;
import com.example.evaluation_service.Feign.CompetenceFeignClient;
import com.example.evaluation_service.Feign.EmployeeFeignClient;
import com.example.evaluation_service.Reoisitory.ElementRepository;
import lombok.AllArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;


@AllArgsConstructor
@Service
public class ServiceElement implements IserviceElement{

    private ElementRepository elementRepository;
    private EmployeeFeignClient employeeFeignClient; // Feign Client for Employee
    private CompetenceFeignClient competenceFeignClient;

    @Override
    public SaisieElement create(SaisieElement element) {
        return elementRepository.save(element);
    }

    @Override
    public SaisieElement update(Long id, SaisieElement element) {
        SaisieElement existing = elementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("SaisieElement not found"));
        element.setId(id); // make sure the ID is preserved
        return elementRepository.save(element);
    }

    @Override
    public void delete(Long id) {
        elementRepository.deleteById(id);
    }

    @Override
    public SaisieElement getById(Long id) {
        return elementRepository.findById(id).orElse(null);
    }

    @Override
    public List<SaisieElement> getAll() {
        return elementRepository.findAll();
    }

    @Override
    public List<SaisieElement> getByEmployeeId(Long employeeId) {
        return elementRepository.findByEmployeeId(employeeId);
    }

    public SaisieElement updateEtat(Long id, Boolean etat) {
        SaisieElement saisie = elementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("SaisieElement not found"));
        saisie.setEtat(etat);
        return elementRepository.save(saisie);
    }

    public byte[] generateExcelFile(List<SaisieElement> saisies) throws IOException {
        XSSFWorkbook workbook = new XSSFWorkbook();
        XSSFSheet sheet = workbook.createSheet("Éléments");

        // Styles
        CellStyle titleStyle = workbook.createCellStyle();
        Font titleFont = workbook.createFont();
        titleFont.setBold(true);
        titleFont.setFontHeightInPoints((short) 16);
        titleStyle.setFont(titleFont);
        titleStyle.setAlignment(HorizontalAlignment.CENTER);

        CellStyle headerStyle = workbook.createCellStyle();
        Font headerFont = workbook.createFont();
        headerFont.setBold(true);
        headerStyle.setFont(headerFont);
        headerStyle.setAlignment(HorizontalAlignment.CENTER);

        int startCol = 2;

        // Titre
        Row titleRow = sheet.createRow(0);
        Cell titleCell = titleRow.createCell(startCol);
        titleCell.setCellValue("LISTE DES ÉLÉMENTS SAISIS");
        titleCell.setCellStyle(titleStyle);
        sheet.addMergedRegion(new CellRangeAddress(0, 0, startCol, startCol + 9));

        // Date export
        Row dateRow = sheet.createRow(1);
        Cell dateCell = dateRow.createCell(startCol);
        dateCell.setCellValue("Date d’exportation : " + LocalDate.now().format(DateTimeFormatter.ofPattern("dd-MM-yyyy")));
        sheet.addMergedRegion(new CellRangeAddress(1, 1, startCol, startCol + 9));

        int rowIdx = 3;

        // En-tête
        String[] headers = {
                "État", "Code Barre", "Quantité", "Ordre Fabrication", "Référence",
                "Désignation", "Code Conception", "Opération", "Désignation Complément",
                "Code Par Section", "Temps", "Client", "Matricule Employé", "Code Compétence"
        };
        Row headerRow = sheet.createRow(rowIdx++);
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(startCol + i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }

        // Données
        for (SaisieElement e : saisies) {
            // Charger l’employé et la compétence si non chargés
            if (e.getEmployee() == null && e.getEmployeeId() != null) {
                e.setEmployee(employeeFeignClient.getEmployeeById(e.getEmployeeId()));
            }
            if (e.getCompetence() == null && e.getCompetenceId() != null) {
                e.setCompetence(competenceFeignClient.getCompetenceById(e.getCompetenceId()));
            }

            Row row = sheet.createRow(rowIdx++);
            int col = startCol;

            row.createCell(col++).setCellValue(e.getEtat() != null ? e.getEtat().toString() : "");
            row.createCell(col++).setCellValue(e.getCodeBarre());
            row.createCell(col++).setCellValue(e.getQuantite() != null ? e.getQuantite() : 0);
            row.createCell(col++).setCellValue(e.getOrdreFabricationNumero());
            row.createCell(col++).setCellValue(e.getReference());
            row.createCell(col++).setCellValue(e.getDesignation());
            row.createCell(col++).setCellValue(e.getCodeConception());
            row.createCell(col++).setCellValue(e.getOperationCode());
            row.createCell(col++).setCellValue(e.getDesignationComplement());
            row.createCell(col++).setCellValue(e.getCodeParSection());
            row.createCell(col++).setCellValue(e.getTemps() != null ? e.getTemps() : 0);
            row.createCell(col++).setCellValue(e.getClientDesignation());
            row.createCell(col++).setCellValue(e.getEmployee() != null ? e.getEmployee().getMatricule() : "");
            row.createCell(col++).setCellValue(e.getCompetence() != null ? e.getCompetence().getCode() : "");
        }

        // Auto-size colonnes
        for (int i = 0; i < headers.length; i++) {
            sheet.autoSizeColumn(startCol + i);
        }

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        workbook.write(outputStream);
        workbook.close();
        return outputStream.toByteArray();
    }



}

