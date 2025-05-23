package com.example.employeservice.Services;

import com.example.employeservice.Entites.Serviceempl;
import com.example.employeservice.Repository.ServiceRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;


@AllArgsConstructor
@Service


public class ServiceService implements IServiceService{


    private ServiceRepository serviceRepository;


    @Override
    public void addservice(Serviceempl service) {
        serviceRepository.save(service);
    }

    @Override
    public Serviceempl getservice(Long id) {
        return serviceRepository.findById(id).orElse(null);
    }

    @Override
    public List<Serviceempl> getAllservices() {
        return serviceRepository.findAll();
    }

    @Override
    public void deleteservice(Long id) {
        serviceRepository.deleteById(id);
    }

    @Override
    public void updateservice(Serviceempl service) {
        if (service.getId() != null && serviceRepository.existsById(service.getId())) {
            serviceRepository.save(service);
        }
    }

    public Serviceempl getServiceByPostId(Long postId) {
        return serviceRepository.findServiceByPostId(postId);
    }

}
