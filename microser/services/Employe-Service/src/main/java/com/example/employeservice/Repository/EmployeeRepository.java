package com.example.employeservice.Repository;

import com.example.employeservice.Entites.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EmployeeRepository extends JpaRepository<Employee,Long> {
    List<Employee> findByPostId(Long postId);


    @Query("SELECT e FROM Employee e JOIN e.post p WHERE p.title LIKE %:mc%")
    List<Employee> findbyNompost(@Param("mc") String mc);

}
