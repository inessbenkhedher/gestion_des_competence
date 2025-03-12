package com.example.employeservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication

public class EmployeServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(EmployeServiceApplication.class, args);
	}

}
