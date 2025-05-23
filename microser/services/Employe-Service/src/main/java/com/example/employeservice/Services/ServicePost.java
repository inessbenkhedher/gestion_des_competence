package com.example.employeservice.Services;

import com.example.employeservice.Dto.postdto;
import com.example.employeservice.Entites.Post;
import com.example.employeservice.Repository.PostRepository;
import com.example.employeservice.mappers.postmapper;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@Service

public class ServicePost implements IServicePost {

    private PostRepository pr;
    private postmapper pmapper;

    @Override
    public void addpost(Post post) {
        pr.save(post);
    }

    @Override
    public Post getpost(Long id) {
        return pr.findById(id).get();
    }

    @Override
    public List<postdto> getAllPosts() {
        List<Post> posts = pr.findAll();
        List<postdto> postdtos = new ArrayList<>();
        for (Post post : posts) {
            postdtos.add(pmapper.postdtofrompostt(post));
        }

        return postdtos;
    }

    @Override
    public void deletePost(Long id) {
        pr.deleteById(id);
    }

    @Override
    public void updatePost(Long id, Post post) {
        Post existing = pr.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Poste non trouvé avec l'id : " + id));

        if (post.getTitle() != null && !post.getTitle().isEmpty()) {
            existing.setTitle(post.getTitle());
        }

        if (post.getDescription() != null && !post.getDescription().isEmpty()) {
            existing.setDescription(post.getDescription());
        }

        if (post.getService() != null &&
                (existing.getService() == null || !existing.getService().getId().equals(post.getService().getId()))) {
            existing.setService(post.getService());
        }

        pr.save(existing);
    }

    public List<Post> getPostsByServiceId(Long serviceId) {
        return pr.findByServiceId(serviceId);
    }
}
