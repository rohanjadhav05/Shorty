package com.urlshortener.exception;

/**
 * Exception thrown when a URL is not found.
 */
public class UrlNotFoundException extends RuntimeException {

    public UrlNotFoundException(String message) {
        super(message);
    }

    public UrlNotFoundException(String shortCode, Throwable cause) {
        super("URL not found for short code: " + shortCode, cause);
    }
}
