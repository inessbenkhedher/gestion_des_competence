package com.example.evaluation_service.Feign;


import com.example.evaluation_service.DTO.Employee;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "employee-service")
public interface EmployeeFeignClient {
    @GetMapping("/employees/{id}")
    Employee getEmployeeById(@PathVariable Long id);
}
