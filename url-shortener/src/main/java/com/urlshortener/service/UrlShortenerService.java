package com.urlshortener.service;

import com.urlshortener.dto.ShortenRequest;
import com.urlshortener.dto.ShortenResponse;
import com.urlshortener.dto.UrlStatsResponse;
import com.urlshortener.exception.InvalidUrlException;
import com.urlshortener.exception.UrlExpiredException;
import com.urlshortener.exception.UrlNotFoundException;
import com.urlshortener.model.Url;
import com.urlshortener.repository.UrlRepository;
import com.urlshortener.util.CompactIdGenerator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.regex.Pattern;

/**
 * Service for URL shortening operations.
 */
@Service
public class UrlShortenerService {

    private static final Logger log = LoggerFactory.getLogger(UrlShortenerService.class);
    private static final Pattern URL_PATTERN = Pattern.compile("^https?://.+");

    @Autowired
    private UrlRepository urlRepository;

    @Autowired
    private CompactIdGenerator idGenerator;

    @Value("${urlshortener.base.url:http://localhost:8080}")
    private String baseUrl;

    /**
     * Shortens a URL.
     *
     * @param request The shorten request containing the long URL and optional parameters
     * @return ShortenResponse with the shortened URL details
     * @throws InvalidUrlException if the URL is invalid or custom alias is taken
     */
    public ShortenResponse shortenUrl(ShortenRequest request) {
        log.info("========== SHORTEN URL REQUEST ==========");
        log.info("Long URL: {}", request.getLongUrl());
        log.debug("Custom Alias: {}", request.getCustomAlias());
        log.debug("Expiration Days: {}", request.getExpirationDays());

        // Validate URL format
        if (!URL_PATTERN.matcher(request.getLongUrl()).matches()) {
            log.warn("Invalid URL format received: {}", request.getLongUrl());
            throw new InvalidUrlException("Invalid URL format. URL must start with http:// or https://");
        }
        log.debug("URL format validation passed");

        String shortCode;

        // Check if custom alias is provided
        if (request.getCustomAlias() != null && !request.getCustomAlias().isBlank()) {
            log.info("Custom alias requested: {}", request.getCustomAlias());
            
            // Validate custom alias uniqueness
            if (urlRepository.existsByShortCode(request.getCustomAlias())) {
                log.warn("Custom alias '{}' is already in use", request.getCustomAlias());
                throw new InvalidUrlException("Custom alias '" + request.getCustomAlias() + "' is already in use");
            }
            shortCode = request.getCustomAlias();
            log.info("Custom alias '{}' is available, using it as short code", shortCode);
        } else {
            // Check if URL already exists (avoid duplicates)
            log.debug("Checking if long URL already exists in database...");
            Optional<Url> existingUrl = urlRepository.findByLongUrl(request.getLongUrl());
            
            if (existingUrl.isPresent() && !existingUrl.get().isExpired()) {
                log.info("Existing short URL found for this long URL: {}", existingUrl.get().getShortCode());
                log.info("Returning existing short URL instead of creating new one");
                return buildShortenResponse(existingUrl.get());
            }

            // Generate new short code
            log.debug("Generating new Base62 short code...");
            shortCode = idGenerator.generateBase62Id();
            log.debug("Generated short code: {}", shortCode);

            // Ensure uniqueness (collision handling)
            int collisionCount = 0;
            while (urlRepository.existsByShortCode(shortCode)) {
                collisionCount++;
                log.warn("Short code collision detected (attempt {}), regenerating...", collisionCount);
                shortCode = idGenerator.generateBase62Id();
            }
            if (collisionCount > 0) {
                log.info("Resolved {} collision(s), final short code: {}", collisionCount, shortCode);
            }
        }

        // Calculate expiration date if provided
        LocalDateTime expiresAt = null;
        if (request.getExpirationDays() != null && request.getExpirationDays() > 0) {
            expiresAt = LocalDateTime.now().plusDays(request.getExpirationDays());
            log.info("URL will expire on: {}", expiresAt);
        } else {
            log.debug("No expiration set, URL will be permanent");
        }

        // Create and save URL entity
        log.debug("Creating URL entity...");
        Url url = Url.builder()
                .shortCode(shortCode)
                .longUrl(request.getLongUrl())
                .createdAt(LocalDateTime.now())
                .expiresAt(expiresAt)
                .clickCount(0L)
                .build();

        log.debug("Saving URL to database...");
        url = urlRepository.save(url);
        log.info("URL saved successfully - ID: {}, ShortCode: {}", url.getId(), url.getShortCode());
        log.info("Short URL created: {}/{}", baseUrl, shortCode);
        log.info("==========================================");

        return buildShortenResponse(url);
    }

    /**
     * Gets the long URL for a short code.
     * Results are cached for performance.
     *
     * @param shortCode The short code to look up
     * @return The long URL
     * @throws UrlNotFoundException if the short code is not found
     * @throws UrlExpiredException  if the URL has expired
     */
    @Cacheable(value = "urls", key = "#shortCode")
    public String getLongUrl(String shortCode) {
        log.info("========== GET LONG URL REQUEST ==========");
        log.info("Short code: {}", shortCode);

        log.debug("Looking up short code in database...");
        Url url = urlRepository.findByShortCode(shortCode)
                .orElseThrow(() -> {
                    log.error("URL not found for short code: {}", shortCode);
                    return new UrlNotFoundException("URL not found for short code: " + shortCode);
                });
        log.debug("URL found - ID: {}", url.getId());

        // Check expiration
        if (url.isExpired()) {
            log.warn("URL has expired! Short code: {}, Expired at: {}", shortCode, url.getExpiresAt());
            throw new UrlExpiredException(shortCode);
        }
        log.debug("URL is not expired");

        // Increment click count
        long previousCount = url.getClickCount() != null ? url.getClickCount() : 0;
        url.incrementClickCount();
        log.debug("Click count incremented: {} -> {}", previousCount, url.getClickCount());
        
        urlRepository.save(url);
        log.debug("Updated click count saved to database");

        log.info("Redirecting to: {}", url.getLongUrl());
        log.info("Total clicks for this URL: {}", url.getClickCount());
        log.info("==========================================");

        return url.getLongUrl();
    }

    /**
     * Gets statistics for a shortened URL.
     *
     * @param shortCode The short code to get stats for
     * @return UrlStatsResponse with the URL statistics
     * @throws UrlNotFoundException if the short code is not found
     */
    public UrlStatsResponse getUrlStats(String shortCode) {
        log.info("========== GET URL STATS REQUEST ==========");
        log.info("Short code: {}", shortCode);

        log.debug("Looking up short code in database...");
        Url url = urlRepository.findByShortCode(shortCode)
                .orElseThrow(() -> {
                    log.error("URL not found for short code: {}", shortCode);
                    return new UrlNotFoundException("URL not found for short code: " + shortCode);
                });

        log.info("Stats retrieved - Short code: {}", url.getShortCode());
        log.info("  Long URL: {}", url.getLongUrl());
        log.info("  Click count: {}", url.getClickCount());
        log.info("  Created at: {}", url.getCreatedAt());
        log.info("  Expires at: {}", url.getExpiresAt() != null ? url.getExpiresAt() : "Never");
        log.info("  Is expired: {}", url.isExpired());
        log.info("===========================================");

        return UrlStatsResponse.builder()
                .shortCode(url.getShortCode())
                .longUrl(url.getLongUrl())
                .clickCount(url.getClickCount())
                .createdAt(url.getCreatedAt())
                .expiresAt(url.getExpiresAt())
                .build();
    }

    /**
     * Deletes a shortened URL.
     *
     * @param shortCode The short code of the URL to delete
     * @throws UrlNotFoundException if the short code is not found
     */
    @CacheEvict(value = "urls", key = "#shortCode")
    public void deleteUrl(String shortCode) {
        log.info("========== DELETE URL REQUEST ==========");
        log.info("Short code to delete: {}", shortCode);

        if (!urlRepository.existsByShortCode(shortCode)) {
            log.error("Cannot delete - URL not found for short code: {}", shortCode);
            throw new UrlNotFoundException("URL not found for short code: " + shortCode);
        }

        log.debug("URL exists, proceeding with deletion...");
        urlRepository.deleteByShortCode(shortCode);
        log.info("URL deleted successfully - Short code: {}", shortCode);
        log.info("Cache evicted for short code: {}", shortCode);
        log.info("========================================");
    }

    /**
     * Builds a ShortenResponse from a Url entity.
     *
     * @param url The Url entity
     * @return ShortenResponse DTO
     */
    private ShortenResponse buildShortenResponse(Url url) {
        log.debug("Building ShortenResponse for short code: {}", url.getShortCode());
        return ShortenResponse.builder()
                .shortUrl(baseUrl + "/" + url.getShortCode())
                .shortCode(url.getShortCode())
                .longUrl(url.getLongUrl())
                .createdAt(url.getCreatedAt())
                .expiresAt(url.getExpiresAt())
                .build();
    }
}
