package com.example.employeservice.Services;

import com.example.employeservice.Dto.employeedto;
import com.example.employeservice.Entites.Employee;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;

public interface IServiceEmploye {
    public void addemployee(Employee employee);
    public Employee getemployee(Long id);
    public List<employeedto> getAllemployee();
    public void deleteemployee(Long id);
    public void updateemployee(Long id, Employee employee);
    public List<Employee> getEmployeesByPost(String mc);
    public List<Employee> getEmployeesByName(String name);
    public void exportEmployeesToExcel(HttpServletResponse response)throws IOException;
    public List<Employee> getEmployeesByPostid(Long id);
}
