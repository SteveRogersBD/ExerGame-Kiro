package com.example.UserService.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.*;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class CorsConfig {
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration cfg = new CorsConfiguration();
        // use allowedOriginPatterns if you might need wildcards; for a single origin, allowedOrigins is fine
        cfg.setAllowedOrigins(List.of("http://localhost:3000"));
        // If you plan to send cookies/JWT in cookies from the browser, also set allowCredentials(true)
        cfg.setAllowCredentials(true); // if you don't need cookies, you can set this false
        cfg.setAllowedMethods(List.of("GET","POST","PUT","PATCH","DELETE","OPTIONS"));
        cfg.setAllowedHeaders(List.of("Content-Type","Authorization","X-Requested-With","Accept","Origin"));
        // Optional: expose headers you want the frontend to read
        cfg.setExposedHeaders(List.of("Location"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // Apply to all endpoints; narrow if you prefer
        source.registerCorsConfiguration("/**", cfg);
        return source;
    }
}
