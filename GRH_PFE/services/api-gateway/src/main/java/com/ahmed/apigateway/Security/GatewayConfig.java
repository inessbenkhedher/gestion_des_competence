package com.ahmed.apigateway.Security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsConfigurationSource;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
import org.springframework.web.cors.reactive.CorsWebFilter;

import java.util.List;

@Configuration
public class GatewayConfig {

    @Bean
    public CorsWebFilter corsWebFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration corsConfig = new CorsConfiguration();

        corsConfig.setAllowedOrigins(List.of("http://localhost:4200")); // Frontend origin
        corsConfig.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS")); // Allowed methods
        corsConfig.setAllowedHeaders(List.of("*")); // Allowed headers
        corsConfig.setAllowCredentials(true); // Allow credentials

        source.registerCorsConfiguration("/**", corsConfig);

        // Log CORS headers
        System.out.println("CORS Config: " + corsConfig);

        return new CorsWebFilter(source);  // Returns CORS filter to the Gateway
    }
}
