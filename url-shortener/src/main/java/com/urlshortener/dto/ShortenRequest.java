package com.urlshortener.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Positive;
import javax.validation.constraints.Size;

/**
 * Request DTO for creating a shortened URL.
 */
@Schema(description = "Request body for creating a shortened URL")
public class ShortenRequest {

    @Schema(description = "The long URL to shorten", 
            example = "https://www.example.com/very/long/url/path",
            required = true)
    @NotBlank(message = "Long URL is required")
    @Pattern(regexp = "^https?://.+", message = "URL must start with http:// or https://")
    private String longUrl;

    @Schema(description = "Custom alias for the short URL (optional)", 
            example = "mylink",
            minLength = 3, 
            maxLength = 20)
    @Size(min = 3, max = 20, message = "Custom alias must be between 3 and 20 characters")
    @Pattern(regexp = "^[a-zA-Z0-9_-]*$", message = "Custom alias can only contain alphanumeric characters, hyphens, and underscores")
    private String customAlias;

    @Schema(description = "Number of days until the URL expires (optional)", 
            example = "30",
            minimum = "1")
    @Positive(message = "Expiration days must be a positive number")
    private Integer expirationDays;

    public ShortenRequest() {
    }

    public ShortenRequest(String longUrl, String customAlias, Integer expirationDays) {
        this.longUrl = longUrl;
        this.customAlias = customAlias;
        this.expirationDays = expirationDays;
    }

    public String getLongUrl() {
        return longUrl;
    }

    public void setLongUrl(String longUrl) {
        this.longUrl = longUrl;
    }

    public String getCustomAlias() {
        return customAlias;
    }

    public void setCustomAlias(String customAlias) {
        this.customAlias = customAlias;
    }

    public Integer getExpirationDays() {
        return expirationDays;
    }

    public void setExpirationDays(Integer expirationDays) {
        this.expirationDays = expirationDays;
    }
}
