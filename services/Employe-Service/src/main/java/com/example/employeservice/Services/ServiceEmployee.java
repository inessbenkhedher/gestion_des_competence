package com.example.employeservice.Services;

import com.example.employeservice.Dto.employeedto;
import com.example.employeservice.Entites.Employee;
import com.example.employeservice.Repository.EmployeeRepository;
import com.example.employeservice.mappers.Employeemapper;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

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

    @Override
    public void updateemployee(Employee employee) {
        er.save(employee);
    }

    public List<Employee> getEmployeesByPost(Long postId) {
        return er.findByPostId(postId);
    }
}
