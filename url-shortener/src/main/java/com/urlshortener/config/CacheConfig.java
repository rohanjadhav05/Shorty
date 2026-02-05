package com.urlshortener.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.TimeUnit;

/**
 * Configuration for Caffeine cache.
 */
@Configuration
@EnableCaching
public class CacheConfig {

    /**
     * Creates a Caffeine cache manager with configured settings.
     * - Maximum size: 10,000 entries
     * - Expire after access: 24 hours
     *
     * @return CacheManager instance
     */
    @Bean
    public CacheManager cacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager("urls");
        cacheManager.setCaffeine(Caffeine.newBuilder()
                .maximumSize(10_000)
                .expireAfterAccess(24, TimeUnit.HOURS)
                .recordStats());
        return cacheManager;
    }
}
