package com.example.employeservice.Repository;

import com.example.employeservice.Entites.Post;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post,Long> {
}
