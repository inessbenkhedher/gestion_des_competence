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
    public void updatePost(Post post) {
        pr.save(post);
    }
}
