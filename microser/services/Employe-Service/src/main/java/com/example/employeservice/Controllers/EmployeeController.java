package com.example.employeservice.Controllers;


import com.example.employeservice.Dto.employeedto;
import com.example.employeservice.Entites.Employee;
import com.example.employeservice.Entites.Post;
import com.example.employeservice.Services.IServiceEmploye;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/employees")
public class EmployeeController {

    private IServiceEmploye serviceEmployee;

    @PostMapping
    public void addEmployee(@RequestBody Employee employee) {
        serviceEmployee.addemployee(employee);
    }

    @GetMapping("/{id}")
    public Employee getEmployee(@PathVariable Long id) {
        return serviceEmployee.getemployee(id);
    }

    @GetMapping
    public List<employeedto> getAllEmployees() {
        return serviceEmployee.getAllemployee();
    }

    @DeleteMapping("/{id}")
    public void deleteEmployee(@PathVariable Long id) {
        serviceEmployee.deleteemployee(id);
    }

    @PutMapping("/{id}")
    public void updateEmployee(@RequestBody Employee employee , @PathVariable Long id) {
        serviceEmployee.updateemployee(id ,employee );
    }

    @GetMapping("/byPost")
    public ResponseEntity<List<Employee>> getEmployeesByPost(@RequestParam String mc) {
        List<Employee> employees = serviceEmployee.getEmployeesByPost(mc);
        return ResponseEntity.ok(employees);
    }

    @GetMapping("/parNom")
    public ResponseEntity<List<Employee>> getEmployeesByNom(@RequestParam String mc) {
        List<Employee> employees = serviceEmployee.getEmployeesByName(mc);
        return ResponseEntity.ok(employees);
    }

    @GetMapping("/byposte/{postId}")
    public List<Employee> getPostsByServiceId(@PathVariable Long postId) {
        return serviceEmployee.getEmployeesByPostid (postId);
    }

    @GetMapping("/export")
    public void exportToExcel(HttpServletResponse response) throws IOException {
        serviceEmployee.exportEmployeesToExcel(response);
    }
}
