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
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import org.apache.poi.ss.usermodel.*;


import java.awt.*;
import java.io.IOException;
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
        Sheet sheet = workbook.createSheet("Competences");

        // Créer une ligne pour les en-têtes
        Row headerRow = sheet.createRow(0);
        String[] headers = {"Code", "Designation", "Observatin", "Indicateur"};

        // Définir le style pour l'en-tête
        CellStyle headerStyle = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        headerStyle.setFont(font);

        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }

        // Remplir les données
        int rowNum = 1;
        for (Competence competence : competences) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(competence.getCode());
            row.createCell(1).setCellValue(competence.getDesignation());
            row.createCell(2).setCellValue(competence.getObservatin());
            Indicateur indicateur = competence.getIndicateur();
            if (indicateur != null) {
                row.createCell(3).setCellValue(indicateur.getTitle());
            } else {
                row.createCell(3).setCellValue("N/A"); // Handle case where Indicateur is null
            }
        }

        // Ajuster automatiquement la taille des colonnes
        for (int i = 0; i < headers.length; i++) {
            sheet.autoSizeColumn(i);
        }

        // Définir le type de contenu du fichier de réponse
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
