package com.example.employeservice.Services;

import com.example.employeservice.Dto.employeedto;
import com.example.employeservice.Entites.Employee;
import com.example.employeservice.Entites.Post;
import com.example.employeservice.Repository.EmployeeRepository;
import com.example.employeservice.mappers.Employeemapper;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@Service
public class ServiceEmployee implements IServiceEmploye{

    private EmployeeRepository er;
    private Employeemapper emapper;

    @Override
    public void addemployee(Employee employee) {
        er.save(employee);
    }

    @Override
    public Employee getemployee(Long id) {
        return er.findById(id).get();
    }

    @Override
    public List<employeedto> getAllemployee() {
        List<Employee> l = er.findAll();
        List<employeedto> employeedtos = new ArrayList<>();
        for (Employee e : l) {
            employeedtos.add(emapper.employedtofromemployee(e));
        }
        return employeedtos;
    }

    @Override
    public void deleteemployee(Long id) {
        er.deleteById(id);
    }

    public void updateemployee(Long id, Employee employee) {
        Employee existing = er.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Employé non trouvé"));

        if (employee.getMatricule() != null && !employee.getMatricule().isEmpty()) {
            existing.setMatricule(employee.getMatricule());
        }
        if (employee.getNom() != null && !employee.getNom().isEmpty()) {
            existing.setNom(employee.getNom());
        }
        if (employee.getPrenom() != null && !employee.getPrenom().isEmpty()) {
            existing.setPrenom(employee.getPrenom());
        }
        if (employee.getTelephone() != null) {
            existing.setTelephone(employee.getTelephone());
        }
        if (employee.getEmail() != null && !employee.getEmail().isEmpty()) {
            existing.setEmail(employee.getEmail());
        }
        if (employee.getAdresse() != null && !employee.getAdresse().isEmpty()) {
            existing.setAdresse(employee.getAdresse());
        }
        if (employee.getDateNaissance() != null) {
            existing.setDateNaissance(employee.getDateNaissance());
        }
        if (employee.getDateEmbauche() != null) {
            existing.setDateEmbauche(employee.getDateEmbauche());
        }
        if (employee.getService() != null && !employee.getService().isEmpty()) {
            existing.setService(employee.getService());
        }

        if (employee.getPost() != null &&
                (existing.getPost() == null || !existing.getPost().getId().equals(employee.getPost().getId()))) {

            Post newPost = employee.getPost(); // or retrieve it from repo if you want to be safe
            existing.setPost(newPost);
        }

        er.save(existing);
    }

    public List<Employee> getEmployeesByPost(String mc) {
        return er.findbyNompost(mc);
    }

    public List<Employee> getEmployeesByName(String name) {
        return er.searchEmployees(name);
    }

    public void exportEmployeesToExcel(HttpServletResponse response) throws IOException {
        List<Employee> employees = er.findAll();

        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Employees");

        // Header row
        Row headerRow = sheet.createRow(0);
        String[] headers = {
                "ID", "Matricule", "Nom", "Prenom", "Téléphone", "Email",
                "Adresse", "Date Naissance", "Date Embauche", "Service", "Poste"
        };

        CellStyle headerStyle = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        headerStyle.setFont(font);

        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }

        int rowNum = 1;
        for (Employee e : employees) {
            Row row = sheet.createRow(rowNum++);

            row.createCell(0).setCellValue(e.getId());
            row.createCell(1).setCellValue(e.getMatricule());
            row.createCell(2).setCellValue(e.getNom());
            row.createCell(3).setCellValue(e.getPrenom());
            row.createCell(4).setCellValue(e.getTelephone() != null ? e.getTelephone().toString() : "");
            row.createCell(5).setCellValue(e.getEmail());
            row.createCell(6).setCellValue(e.getAdresse());
            row.createCell(7).setCellValue(e.getDateNaissance() != null ? e.getDateNaissance().toString() : "");
            row.createCell(8).setCellValue(e.getDateEmbauche() != null ? e.getDateEmbauche().toString() : "");
            row.createCell(9).setCellValue(e.getService());
            row.createCell(10).setCellValue(e.getPost() != null ? e.getPost().getTitle() : "N/A");
        }

        for (int i = 0; i < headers.length; i++) {
            sheet.autoSizeColumn(i);
        }

        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setHeader("Content-Disposition", "attachment; filename=employees.xlsx");

        workbook.write(response.getOutputStream());
        workbook.close();
    }
}
