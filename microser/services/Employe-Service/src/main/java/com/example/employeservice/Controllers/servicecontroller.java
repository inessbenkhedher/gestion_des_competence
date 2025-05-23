package com.example.employeservice.Controllers;


import com.example.employeservice.Entites.Serviceempl;
import com.example.employeservice.Services.IServiceService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor

@RequestMapping("/services")
public class servicecontroller {

    private IServiceService serviceService;

    @PostMapping
    public void addService(@RequestBody Serviceempl service) {
        serviceService.addservice(service);
    }

    @GetMapping("/{id}")
    public Serviceempl getService(@PathVariable Long id) {
        return serviceService.getservice(id);
    }

    @GetMapping
    public List<Serviceempl> getAllServices() {
        return serviceService.getAllservices();
    }

    @DeleteMapping("/{id}")
    public void deleteService(@PathVariable Long id) {
        serviceService.deleteservice(id);
    }

    @PutMapping
    public void updateService(@RequestBody Serviceempl service) {
        serviceService.updateservice(service);
    }

    @GetMapping("/by-post/{postId}")
    public ResponseEntity<Serviceempl> getServiceByPostId(@PathVariable Long postId) {
        Serviceempl service = serviceService.getServiceByPostId(postId);
        if (service != null) {
            return ResponseEntity.ok(service);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
