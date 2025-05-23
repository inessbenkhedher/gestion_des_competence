package com.example.evaluation_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class EvaluationServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(EvaluationServiceApplication.class, args);
	}

}
