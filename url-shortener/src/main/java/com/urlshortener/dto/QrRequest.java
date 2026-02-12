package com.urlshortener.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;

/**
 * Request DTO for generating a QR code.
 */
@Schema(description = "Request body for generating a QR code from a URL")
public class QrRequest {

    @Schema(description = "The URL to encode in the QR code",
            example = "https://www.example.com/very/long/url/path",
            required = true)
    @NotBlank(message = "URL is required")
    @Pattern(regexp = "^https?://.+", message = "URL must start with http:// or https://")
    private String url;

    @Schema(description = "Size of the QR code in pixels (width and height)",
            example = "300",
            minimum = "100",
            maximum = "1000")
    @Min(value = 100, message = "Size must be at least 100 pixels")
    @Max(value = 1000, message = "Size must not exceed 1000 pixels")
    private Integer size;

    public QrRequest() {
    }

    public QrRequest(String url, Integer size) {
        this.url = url;
        this.size = size;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public Integer getSize() {
        return size;
    }

    public void setSize(Integer size) {
        this.size = size;
    }

    /**
     * Returns the size or default value (300) if not specified.
     */
    public int getSizeOrDefault() {
        return size != null ? size : 300;
    }
}
