package com.urlshortener.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

/**
 * Response DTO for a shortened URL.
 */
@Schema(description = "Response containing the shortened URL details")
public class ShortenResponse {

    @Schema(description = "The complete short URL", example = "http://localhost:8080/ABC1234")
    private String shortUrl;

    @Schema(description = "The short code", example = "ABC1234")
    private String shortCode;

    @Schema(description = "The original long URL", example = "https://www.example.com/very/long/url/path")
    private String longUrl;

    @Schema(description = "When the short URL was created", example = "2024-01-15T10:30:00")
    private LocalDateTime createdAt;

    @Schema(description = "When the short URL expires (null if no expiration)", example = "2024-02-14T10:30:00")
    private LocalDateTime expiresAt;

    public ShortenResponse() {
    }

    public ShortenResponse(String shortUrl, String shortCode, String longUrl,
                           LocalDateTime createdAt, LocalDateTime expiresAt) {
        this.shortUrl = shortUrl;
        this.shortCode = shortCode;
        this.longUrl = longUrl;
        this.createdAt = createdAt;
        this.expiresAt = expiresAt;
    }

    public String getShortUrl() {
        return shortUrl;
    }

    public void setShortUrl(String shortUrl) {
        this.shortUrl = shortUrl;
    }

    public String getShortCode() {
        return shortCode;
    }

    public void setShortCode(String shortCode) {
        this.shortCode = shortCode;
    }

    public String getLongUrl() {
        return longUrl;
    }

    public void setLongUrl(String longUrl) {
        this.longUrl = longUrl;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String shortUrl;
        private String shortCode;
        private String longUrl;
        private LocalDateTime createdAt;
        private LocalDateTime expiresAt;

        public Builder shortUrl(String shortUrl) {
            this.shortUrl = shortUrl;
            return this;
        }

        public Builder shortCode(String shortCode) {
            this.shortCode = shortCode;
            return this;
        }

        public Builder longUrl(String longUrl) {
            this.longUrl = longUrl;
            return this;
        }

        public Builder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public Builder expiresAt(LocalDateTime expiresAt) {
            this.expiresAt = expiresAt;
            return this;
        }

        public ShortenResponse build() {
            return new ShortenResponse(shortUrl, shortCode, longUrl, createdAt, expiresAt);
        }
    }
}
