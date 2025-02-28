package com.ahmed.hello.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/hello")
@CrossOrigin(origins = "http://localhost:4200")
public class HelloWorldController {

    @GetMapping
    @PreAuthorize("hasRole('client_user')")
    public ResponseEntity<Map<String, String>> sayHello() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Hello, World! From User Service!");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('client_admin')")
    public ResponseEntity<Map<String, String>> helloAdmin() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Hello, World! From Admin Service!");
        return ResponseEntity.ok(response);
    }
}