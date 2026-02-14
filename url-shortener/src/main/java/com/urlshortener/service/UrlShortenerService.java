package com.urlshortener.service;

import com.urlshortener.dto.ShortenRequest;
import com.urlshortener.dto.ShortenResponse;
import com.urlshortener.dto.UrlStatsResponse;
import com.urlshortener.exception.InvalidUrlException;
import com.urlshortener.exception.UrlAlreadyExistsException;
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
    private static final Pattern URL_PATTERN =  Pattern.compile(
            "^(https?://)" +
                    "(" +
                    "localhost" +
                    "|" +
                    "([a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,}" +
                    "|" +
                    "(\\d{1,3}\\.){3}\\d{1,3}" +
                    ")" +
                    "(:\\d{1,5})?" +
                    "(/[^\\s]*)?$"
    );


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
        validateUrlFormat(request.getLongUrl());
        try {
            String shortCode = resolveShortCode(request);
            LocalDateTime expiresAt = calculateExpiration(request.getExpirationDays());
            Url url = createUrlEntity(request.getLongUrl(), shortCode, expiresAt);
            url = urlRepository.save(url);
            log.info("URL saved successfully - ID: {}, ShortCode: {}", url.getId(), url.getShortCode());
            log.info("==========================================");
            return buildShortenResponse(url);
        } catch (UrlAlreadyExistsException ex) {
            log.error("Returning existing shortened URL instead of creating new one");
            return buildShortenResponse(ex.getExistingUrl());
        }
    }


    private void validateUrlFormat(String longUrl) {
        if (!URL_PATTERN.matcher(longUrl).matches()) {
            log.warn("Invalid URL format received: {}", longUrl);
            throw new InvalidUrlException("Invalid URL format. URL must start with http:// or https://");
        }
        log.debug("URL format validation passed");
    }

    private String resolveShortCode(ShortenRequest request) {

        if (hasCustomAlias(request)) {
            return handleCustomAlias(request.getCustomAlias());
        }

        Optional<Url> existing = findExistingActiveUrl(request.getLongUrl());

        if (existing.isPresent()) {
            log.info("Existing short URL found: {}", existing.get().getShortCode());
            throw new UrlAlreadyExistsException(existing.get());
        }

        return generateUniqueShortCode();
    }

    private boolean hasCustomAlias(ShortenRequest request) {
        return request.getCustomAlias() != null && !request.getCustomAlias().isBlank();
    }

    private String handleCustomAlias(String alias) {

        log.info("Custom alias requested: {}", alias);

        if (urlRepository.existsByShortCode(alias)) {
            log.warn("Custom alias '{}' already in use", alias);
            throw new InvalidUrlException("Custom alias '" + alias + "' is already in use");
        }

        return alias;
    }


    private Optional<Url> findExistingActiveUrl(String longUrl) {

        log.debug("Checking if long URL already exists...");

        Optional<Url> existing = urlRepository.findByLongUrl(longUrl);

        return existing.filter(url -> !url.isExpired());
    }


    private String generateUniqueShortCode() {

        log.debug("Generating new Base62 short code...");

        String shortCode = idGenerator.generateBase62Id();
        int collisionCount = 0;

        while (urlRepository.existsByShortCode(shortCode)) {
            collisionCount++;
            log.warn("Collision detected (attempt {})", collisionCount);
            shortCode = idGenerator.generateBase62Id();
        }

        if (collisionCount > 0) {
            log.info("Resolved {} collision(s)", collisionCount);
        }

        return shortCode;
    }


    private LocalDateTime calculateExpiration(Integer expirationDays) {

        if (expirationDays != null && expirationDays > 0) {
            LocalDateTime expiresAt = LocalDateTime.now().plusDays(expirationDays);
            log.info("URL will expire on: {}", expiresAt);
            return expiresAt;
        }

        log.debug("No expiration set");
        return null;
    }


    private Url createUrlEntity(String longUrl, String shortCode, LocalDateTime expiresAt) {

        log.debug("Creating URL entity...");

        return Url.builder()
                .shortCode(shortCode)
                .longUrl(longUrl)
                .createdAt(LocalDateTime.now())
                .expiresAt(expiresAt)
                .clickCount(0L)
                .build();
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
    public String getLongUrl(String shortCode) {
        Url url = getCacheableUrl(shortCode);
        if (url.isExpired()) {
            throw new UrlExpiredException(shortCode);
        }
        urlRepository.incrementClickCount(shortCode); // atomic DB update
        return url.getLongUrl();
    }

    @Cacheable(value = "urls", key = "#shortCode")
    public Url getCacheableUrl(String shortCode) {
        return urlRepository.findByShortCode(shortCode)
                .orElseThrow(() -> {
                    log.error("URL not found for short code: {}", shortCode);
                    return new UrlNotFoundException("URL not found for short code: " + shortCode);
                });
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
        Url url = getUrlFromDB(shortCode);
        return UrlStatsResponse.builder()
                .shortCode(url.getShortCode())
                .longUrl(url.getLongUrl())
                .clickCount(url.getClickCount())
                .createdAt(url.getCreatedAt())
                .expiresAt(url.getExpiresAt())
                .build();
    }

    private Url getUrlFromDB(String shortCode) {
        return urlRepository.findByShortCode(shortCode)
                .orElseThrow(() -> {
                    return new UrlNotFoundException("URL not found for short code: " + shortCode);
                });
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
        if (!urlRepository.existsByShortCode(shortCode)) {
            log.error("Cannot delete - URL not found for short code: {}", shortCode);
            throw new UrlNotFoundException("URL not found for short code: " + shortCode);
        }

        urlRepository.deleteByShortCode(shortCode);
        log.info("URL deleted successfully - Short code: {}", shortCode);
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
