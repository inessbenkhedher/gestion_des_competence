package com.example.employeservice.Services;

import com.example.employeservice.Dto.employeedto;
import com.example.employeservice.Entites.Employee;

import java.util.List;

public interface IServiceEmploye {
    public void addemployee(Employee employee);
    public Employee getemployee(Long id);
    public List<employeedto> getAllemployee();
    public void deleteemployee(Long id);
    public void updateemployee(Employee employee);
    public List<Employee> getEmployeesByPost(String mc);
}
