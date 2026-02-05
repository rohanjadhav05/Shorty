package com.urlshortener.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * OpenAPI/Swagger configuration for the URL Shortener API.
 */
@Configuration
public class OpenApiConfig {

    @Value("${urlshortener.base.url:http://localhost:8080}")
    private String baseUrl;

    @Bean
    public OpenAPI urlShortenerOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("URL Shortener API")
                        .description("A high-performance URL shortening service with MongoDB and Caffeine cache. " +
                                "Generates unique 7-character Base62 short codes using a Snowflake-inspired algorithm.")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("URL Shortener Team")
                                .email("support@urlshortener.com")
                                .url("https://github.com/urlshortener"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")))
                .servers(List.of(
                        new Server()
                                .url(baseUrl)
                                .description("URL Shortener Server")));
    }
}
