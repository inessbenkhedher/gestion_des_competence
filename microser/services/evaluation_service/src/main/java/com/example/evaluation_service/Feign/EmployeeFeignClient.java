package com.example.evaluation_service.Feign;


import com.example.evaluation_service.DTO.Employee;
import com.example.evaluation_service.DTO.Post;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "employee-service")
public interface EmployeeFeignClient {
    @GetMapping("/employees/{id}")
    Employee getEmployeeById(@PathVariable Long id);

    @GetMapping("/employees")
    List<Employee> getAllEmployees();

    @GetMapping("/posts/{id}")
    Post getPostById(@PathVariable Long id);
}
