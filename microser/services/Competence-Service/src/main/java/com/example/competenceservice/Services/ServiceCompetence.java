package com.example.competenceservice.Services;

import com.example.competenceservice.Dto.CompetenceDto;
import com.example.competenceservice.Entites.Competence;
import com.example.competenceservice.Entites.Famille;
import com.example.competenceservice.Entites.Indicateur;
import com.example.competenceservice.Mappers.CompetenceMapper;
import com.example.competenceservice.Repository.CompetenceRepository;
import com.example.competenceservice.Repository.IndicateurRepository;
import io.micrometer.core.instrument.MultiGauge;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import org.apache.poi.ss.usermodel.*;


import java.awt.*;
import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;


@AllArgsConstructor
@Service
public class ServiceCompetence implements IServiceCompetence{

    private CompetenceRepository cr;
    private IndicateurRepository ir;
    private CompetenceMapper competenceMapper;

    @Override
    public void addcompetence(Competence competence) {
        cr.save(competence);
    }

    @Override
    public void addCompetencesToIndicateur(Long indicateurId, List<CompetenceDto> competences) {
        Indicateur indicateur = ir.findById(indicateurId)
                .orElseThrow(() -> new RuntimeException("Indicateur non trouvé"));

        for (CompetenceDto dto : competences) {
            Competence competence = Competence.builder()
                    .code(dto.getCode())
                    .designation(dto.getDesignation())
                    .observatin(dto.getObservatin()) // (ou dto.getObservation() si tu corriges)
                    .indicateur(indicateur)
                    .build();
            cr.save(competence);
        }
    }

    @Override
    public Competence getcompetence(Long id) {
        return cr.findById(id).get();
    }

    @Override
    public List<Competence> getAllcompetence() {

        return cr.findAll();
    }

    @Override
    public void deletecompetence(Long id) {
        cr.deleteById(id);
    }

    @Override
    public void updatecompetence(Long id, Competence competence) {
        Competence existing = cr.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("competence non trouvé"));

        if (competence.getCode() != null && !competence.getCode().isEmpty()) {
            existing.setCode(competence.getCode());
        }
        if (competence.getDesignation() != null && !competence.getDesignation().isEmpty()) {
            existing.setDesignation(competence.getDesignation());
        }
        if (competence.getObservatin() != null && !competence.getObservatin().isEmpty()) {
            existing.setObservatin(competence.getObservatin());
        }
        if (competence.getIndicateur() != null &&
                (existing.getIndicateur() == null || !existing.getIndicateur().getId().equals(competence.getIndicateur().getId()))) {

            Indicateur newindi = ir.findById(competence.getIndicateur().getId())
                    .orElseThrow(() -> new IllegalArgumentException("indicateur non trouvée"));

            existing.setIndicateur(newindi);
        }



        cr.save(existing);
    }


    public void exportCompetencesToExcel(HttpServletResponse response) throws IOException {
        List<Competence> competences = cr.findAll();

        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Compétences");

        // Titre principal (centré et en gras)
        Row titleRow = sheet.createRow(0);
        Cell titleCell = titleRow.createCell(0);
        titleCell.setCellValue("Liste des compétences");

        CellStyle titleStyle = workbook.createCellStyle();
        Font titleFont = workbook.createFont();
        titleFont.setBold(true);
        titleFont.setFontHeightInPoints((short) 14);
        titleStyle.setFont(titleFont);
        titleStyle.setAlignment(HorizontalAlignment.CENTER);
        titleCell.setCellStyle(titleStyle);

        // Fusionner les cellules du titre (colonne 0 à 3)
        sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 3));

        // Date d'exportation
        Row dateRow = sheet.createRow(1);
        Cell dateCell = dateRow.createCell(0);
        dateCell.setCellValue("Date d’exportation : " + LocalDate.now());

        CellStyle dateStyle = workbook.createCellStyle();
        dateStyle.setAlignment(HorizontalAlignment.LEFT);
        dateCell.setCellStyle(dateStyle);

        // Nombre total
        Row countRow = sheet.createRow(2);
        Cell countCell = countRow.createCell(0);
        countCell.setCellValue("Nombre total de compétences : " + competences.size());

        CellStyle countStyle = workbook.createCellStyle();
        countStyle.setAlignment(HorizontalAlignment.LEFT);
        countCell.setCellStyle(countStyle);

        // Ligne vide pour espacer
        int rowNum = 4;

        // En-tête du tableau
        Row headerRow = sheet.createRow(rowNum++);
        String[] headers = {"Code", "Désignation", "Observation", "Indicateur"};

        CellStyle headerStyle = workbook.createCellStyle();
        Font headerFont = workbook.createFont();
        headerFont.setBold(true);
        headerStyle.setFont(headerFont);

        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }

        // Remplissage des données
        for (Competence competence : competences) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(competence.getCode());
            row.createCell(1).setCellValue(competence.getDesignation());
            row.createCell(2).setCellValue(competence.getObservatin());

            Indicateur indicateur = competence.getIndicateur();
            row.createCell(3).setCellValue(indicateur != null ? indicateur.getTitle() : "N/A");
        }

        // Auto-size des colonnes
        for (int i = 0; i < headers.length; i++) {
            sheet.autoSizeColumn(i);
        }

        // Configuration de la réponse HTTP
        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setHeader("Content-Disposition", "attachment; filename=competences.xlsx");

        workbook.write(response.getOutputStream());
        workbook.close();
    }


    @Override
    public List<Competence> getCompetencesByIndicateurId(Long indicateurId) {
        return cr.findByIndicateurId(indicateurId);
    }

}
