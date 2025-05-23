package com.example.employeservice.Repository;

import com.example.employeservice.Entites.Serviceempl;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ServiceRepository extends JpaRepository<Serviceempl,Long> {

    @Query("SELECT s FROM Serviceempl s JOIN s.postes p WHERE p.id = :postId")
    Serviceempl findServiceByPostId(Long postId);
}
