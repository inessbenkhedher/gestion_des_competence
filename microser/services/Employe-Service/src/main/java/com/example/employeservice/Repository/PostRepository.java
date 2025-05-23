package com.example.employeservice.Repository;

import com.example.employeservice.Entites.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository extends JpaRepository<Post,Long> {
    List<Post> findByServiceId(Long serviceId);
}
