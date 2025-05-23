package com.example.employeservice.Services;

import com.example.employeservice.Dto.postdto;
import com.example.employeservice.Entites.Employee;
import com.example.employeservice.Entites.Post;

import java.util.List;

public interface IServicePost {
    public void addpost(Post post);
    public  Post getpost(Long id);
    public List<postdto> getAllPosts();
    public void deletePost(Long id);
    public void updatePost(Long id,Post post);
    public List<Post> getPostsByServiceId(Long serviceId);

}
