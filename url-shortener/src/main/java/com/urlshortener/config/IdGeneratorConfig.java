package com.urlshortener.config;

import com.urlshortener.util.CompactIdGenerator;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration for the CompactIdGenerator bean.
 */
@Configuration
public class IdGeneratorConfig {

    @Value("${urlshortener.machine.id:1}")
    private int machineId;

    /**
     * Creates a CompactIdGenerator bean with the configured machine ID.
     *
     * @return CompactIdGenerator instance
     */
    @Bean
    public CompactIdGenerator compactIdGenerator() {
        return new CompactIdGenerator(machineId);
    }
}
