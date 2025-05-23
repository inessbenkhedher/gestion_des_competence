package com.example.employeservice.Controllers;


import com.example.employeservice.Dto.postdto;
import com.example.employeservice.Entites.Post;
import com.example.employeservice.Services.IServicePost;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor

@RequestMapping("/posts")
public class PostController {

    private IServicePost servicePost;

    @PostMapping
    public void addPost(@RequestBody Post post) {
        servicePost.addpost(post);
    }

    @GetMapping("/{id}")
    public Post getPost(@PathVariable Long id) {
        return servicePost.getpost(id);
    }

    @GetMapping
    public List<postdto> getAllPosts() {
        return servicePost.getAllPosts();
    }

    @DeleteMapping("/{id}")
    public void deletePost(@PathVariable Long id) {
        servicePost.deletePost(id);
    }

    @PutMapping("/{id}")
    public void updatePost(@PathVariable Long id, @RequestBody Post post) {
        servicePost.updatePost(id, post);
    }

    @GetMapping("/service/{serviceId}")
    public List<Post> getPostsByServiceId(@PathVariable Long serviceId) {
        return servicePost.getPostsByServiceId(serviceId);
    }
}
