package com.urlshortener.controller;

import com.urlshortener.dto.ShortenRequest;
import com.urlshortener.dto.ShortenResponse;
import com.urlshortener.dto.UrlStatsResponse;
import com.urlshortener.service.UrlShortenerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import javax.validation.Valid;

/**
 * REST Controller for URL shortening operations.
 */
@RestController
@Tag(name = "URL Shortener", description = "APIs for URL shortening operations")
public class UrlShortenerController {

    private static final Logger log = LoggerFactory.getLogger(UrlShortenerController.class);

    @Autowired
    private UrlShortenerService urlShortenerService;

    @Operation(summary = "Shorten a URL", 
               description = "Creates a shortened URL from a long URL. Optionally specify a custom alias and expiration days.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "URL shortened successfully",
                    content = @Content(schema = @Schema(implementation = ShortenResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid URL format or custom alias already exists"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping("/api/shorten")
    public ResponseEntity<ShortenResponse> shortenUrl(
            @Valid @RequestBody ShortenRequest request) {
        log.info("[POST /api/shorten] Incoming request to shorten URL");
        log.debug("[POST /api/shorten] Request body - longUrl: {}, customAlias: {}, expirationDays: {}", 
                request.getLongUrl(), request.getCustomAlias(), request.getExpirationDays());
        
        long startTime = System.currentTimeMillis();
        ShortenResponse response = urlShortenerService.shortenUrl(request);
        long duration = System.currentTimeMillis() - startTime;
        
        log.info("[POST /api/shorten] Response - shortCode: {}, shortUrl: {}", 
                response.getShortCode(), response.getShortUrl());
        log.debug("[POST /api/shorten] Request completed in {} ms", duration);
        
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @Operation(summary = "Get long URL", 
               description = "Retrieves the original long URL for a given short code")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Long URL retrieved successfully",
                    content = @Content(schema = @Schema(implementation = String.class))),
            @ApiResponse(responseCode = "404", description = "Short code not found"),
            @ApiResponse(responseCode = "410", description = "URL has expired")
    })
    @GetMapping("/api/url/{shortCode}")
    public ResponseEntity<String> getLongUrl(
            @Parameter(description = "The short code to look up", example = "ABC1234")
            @PathVariable String shortCode) {
        log.info("[GET /api/url/{}] Incoming request to get long URL", shortCode);
        
        long startTime = System.currentTimeMillis();
        String longUrl = urlShortenerService.getLongUrl(shortCode);
        long duration = System.currentTimeMillis() - startTime;
        
        log.info("[GET /api/url/{}] Resolved to: {}", shortCode, longUrl);
        log.debug("[GET /api/url/{}] Request completed in {} ms", shortCode, duration);
        
        return ResponseEntity.ok(longUrl);
    }

    @Operation(summary = "Redirect to long URL", 
               description = "Redirects the user to the original long URL (use in browser)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "302", description = "Redirect to long URL"),
            @ApiResponse(responseCode = "404", description = "Short code not found"),
            @ApiResponse(responseCode = "410", description = "URL has expired")
    })
    @GetMapping("/{shortCode}")
    public RedirectView redirectToLongUrl(
            @Parameter(description = "The short code to redirect", example = "ABC1234")
            @PathVariable String shortCode) {
        log.info("[GET /{}] Incoming redirect request", shortCode);
        
        long startTime = System.currentTimeMillis();
        String longUrl = urlShortenerService.getLongUrl(shortCode);
        long duration = System.currentTimeMillis() - startTime;
        
        log.info("[GET /{}] Redirecting (302) to: {}", shortCode, longUrl);
        log.debug("[GET /{}] Redirect resolved in {} ms", shortCode, duration);
        
        RedirectView redirectView = new RedirectView();
        redirectView.setUrl(longUrl);
        redirectView.setStatusCode(HttpStatus.FOUND);
        return redirectView;
    }

    @Operation(summary = "Get URL statistics", 
               description = "Retrieves statistics for a shortened URL including click count")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Statistics retrieved successfully",
                    content = @Content(schema = @Schema(implementation = UrlStatsResponse.class))),
            @ApiResponse(responseCode = "404", description = "Short code not found")
    })
    @GetMapping("/api/stats/{shortCode}")
    public ResponseEntity<UrlStatsResponse> getUrlStats(
            @Parameter(description = "The short code to get statistics for", example = "ABC1234")
            @PathVariable String shortCode) {
        log.info("[GET /api/stats/{}] Incoming request to get URL statistics", shortCode);
        
        long startTime = System.currentTimeMillis();
        UrlStatsResponse stats = urlShortenerService.getUrlStats(shortCode);
        long duration = System.currentTimeMillis() - startTime;
        
        log.info("[GET /api/stats/{}] Stats - clickCount: {}, createdAt: {}", 
                shortCode, stats.getClickCount(), stats.getCreatedAt());
        log.debug("[GET /api/stats/{}] Request completed in {} ms", shortCode, duration);
        
        return ResponseEntity.ok(stats);
    }

    @Operation(summary = "Delete a shortened URL", 
               description = "Deletes a shortened URL by its short code")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "URL deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Short code not found")
    })
    @DeleteMapping("/api/url/{shortCode}")
    public ResponseEntity<Void> deleteUrl(
            @Parameter(description = "The short code of the URL to delete", example = "ABC1234")
            @PathVariable String shortCode) {
        log.info("[DELETE /api/url/{}] Incoming request to delete URL", shortCode);
        
        long startTime = System.currentTimeMillis();
        urlShortenerService.deleteUrl(shortCode);
        long duration = System.currentTimeMillis() - startTime;
        
        log.info("[DELETE /api/url/{}] URL deleted successfully", shortCode);
        log.debug("[DELETE /api/url/{}] Request completed in {} ms", shortCode, duration);
        
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Health check", 
               description = "Check if the URL Shortener service is running")
    @ApiResponse(responseCode = "200", description = "Service is running")
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        log.debug("[GET /health] Health check requested");
        return ResponseEntity.ok("URL Shortener is running!");
    }
}
