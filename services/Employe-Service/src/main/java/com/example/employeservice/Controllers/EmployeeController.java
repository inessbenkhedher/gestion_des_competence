package com.example.employeservice.Controllers;


import com.example.employeservice.Dto.employeedto;
import com.example.employeservice.Entites.Employee;
import com.example.employeservice.Services.IServiceEmploye;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @PutMapping
    public void updateEmployee(@RequestBody Employee employee) {
        serviceEmployee.updateemployee(employee);
    }

    @GetMapping("/byPost/{postId}")
    public ResponseEntity<List<Employee>> getEmployeesByPost(@PathVariable Long postId) {
        List<Employee> employees = serviceEmployee.getEmployeesByPost(postId);
        return ResponseEntity.ok(employees);
    }
}
