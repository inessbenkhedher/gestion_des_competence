package com.example.employeservice.Repository;

import com.example.employeservice.Entites.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmployeeRepository extends JpaRepository<Employee,Long> {
    List<Employee> findByPostId(Long postId);
}
