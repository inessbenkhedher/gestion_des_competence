package com.example.employeservice.Services;

import com.example.employeservice.Entites.Serviceempl;

import java.util.List;

public interface IServiceService {
    public void addservice(Serviceempl service);
    public Serviceempl getservice(Long id);
    public List<Serviceempl> getAllservices();
    public void deleteservice(Long id);
    public void updateservice(Serviceempl service);
    public Serviceempl getServiceByPostId(Long postId);
}
