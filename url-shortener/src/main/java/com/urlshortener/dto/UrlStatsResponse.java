package com.urlshortener.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

/**
 * Response DTO for URL statistics.
 */
@Schema(description = "Response containing URL statistics")
public class UrlStatsResponse {

    @Schema(description = "The short code", example = "ABC1234")
    private String shortCode;

    @Schema(description = "The original long URL", example = "https://www.example.com/very/long/url/path")
    private String longUrl;

    @Schema(description = "Number of times the short URL has been accessed", example = "42")
    private Long clickCount;

    @Schema(description = "When the short URL was created", example = "2024-01-15T10:30:00")
    private LocalDateTime createdAt;

    @Schema(description = "When the short URL expires (null if no expiration)", example = "2024-02-14T10:30:00")
    private LocalDateTime expiresAt;

    public UrlStatsResponse() {
    }

    public UrlStatsResponse(String shortCode, String longUrl, Long clickCount,
                            LocalDateTime createdAt, LocalDateTime expiresAt) {
        this.shortCode = shortCode;
        this.longUrl = longUrl;
        this.clickCount = clickCount;
        this.createdAt = createdAt;
        this.expiresAt = expiresAt;
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

    public Long getClickCount() {
        return clickCount;
    }

    public void setClickCount(Long clickCount) {
        this.clickCount = clickCount;
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
        private String shortCode;
        private String longUrl;
        private Long clickCount;
        private LocalDateTime createdAt;
        private LocalDateTime expiresAt;

        public Builder shortCode(String shortCode) {
            this.shortCode = shortCode;
            return this;
        }

        public Builder longUrl(String longUrl) {
            this.longUrl = longUrl;
            return this;
        }

        public Builder clickCount(Long clickCount) {
            this.clickCount = clickCount;
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

        public UrlStatsResponse build() {
            return new UrlStatsResponse(shortCode, longUrl, clickCount, createdAt, expiresAt);
        }
    }
}
