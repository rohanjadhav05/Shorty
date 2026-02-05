package com.urlshortener.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Global exception handler for REST API errors.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    /**
     * Handles URL not found exceptions.
     *
     * @param ex The exception
     * @return Error response with 404 status
     */
    @ExceptionHandler(UrlNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleUrlNotFoundException(UrlNotFoundException ex) {
        log.warn("========== URL NOT FOUND EXCEPTION ==========");
        log.warn("Message: {}", ex.getMessage());
        log.debug("Stack trace:", ex);
        log.warn("==============================================");
        return buildErrorResponse(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    /**
     * Handles invalid URL exceptions.
     *
     * @param ex The exception
     * @return Error response with 400 status
     */
    @ExceptionHandler(InvalidUrlException.class)
    public ResponseEntity<Map<String, Object>> handleInvalidUrlException(InvalidUrlException ex) {
        log.warn("========== INVALID URL EXCEPTION ==========");
        log.warn("Message: {}", ex.getMessage());
        log.debug("Stack trace:", ex);
        log.warn("============================================");
        return buildErrorResponse(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    /**
     * Handles URL expired exceptions.
     *
     * @param ex The exception
     * @return Error response with 410 status
     */
    @ExceptionHandler(UrlExpiredException.class)
    public ResponseEntity<Map<String, Object>> handleUrlExpiredException(UrlExpiredException ex) {
        log.warn("========== URL EXPIRED EXCEPTION ==========");
        log.warn("Message: {}", ex.getMessage());
        log.debug("Stack trace:", ex);
        log.warn("============================================");
        return buildErrorResponse(ex.getMessage(), HttpStatus.GONE);
    }

    /**
     * Handles validation exceptions from @Valid annotations.
     *
     * @param ex The exception
     * @return Error response with 400 status and validation details
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationException(MethodArgumentNotValidException ex) {
        String errors = ex.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining(", "));
        
        log.warn("========== VALIDATION EXCEPTION ==========");
        log.warn("Validation errors: {}", errors);
        ex.getBindingResult().getFieldErrors().forEach(error -> 
            log.warn("  Field '{}': {}", error.getField(), error.getDefaultMessage())
        );
        log.debug("Stack trace:", ex);
        log.warn("==========================================");
        
        return buildErrorResponse(errors, HttpStatus.BAD_REQUEST);
    }

    /**
     * Handles illegal argument exceptions.
     *
     * @param ex The exception
     * @return Error response with 400 status
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalArgumentException(IllegalArgumentException ex) {
        log.warn("========== ILLEGAL ARGUMENT EXCEPTION ==========");
        log.warn("Message: {}", ex.getMessage());
        log.debug("Stack trace:", ex);
        log.warn("=================================================");
        return buildErrorResponse(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    /**
     * Handles illegal state exceptions (e.g., clock backwards).
     *
     * @param ex The exception
     * @return Error response with 500 status
     */
    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalStateException(IllegalStateException ex) {
        log.error("========== ILLEGAL STATE EXCEPTION ==========");
        log.error("Message: {}", ex.getMessage());
        log.error("Stack trace:", ex);
        log.error("==============================================");
        return buildErrorResponse(ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    /**
     * Handles all other exceptions.
     *
     * @param ex The exception
     * @return Error response with 500 status
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGenericException(Exception ex) {
        log.error("========== UNEXPECTED EXCEPTION ==========");
        log.error("Exception type: {}", ex.getClass().getName());
        log.error("Message: {}", ex.getMessage());
        log.error("Stack trace:", ex);
        log.error("==========================================");
        return buildErrorResponse("An unexpected error occurred: " + ex.getMessage(),
                HttpStatus.INTERNAL_SERVER_ERROR);
    }

    /**
     * Builds a standardized error response.
     *
     * @param message The error message
     * @param status  The HTTP status
     * @return ResponseEntity with error details
     */
    private ResponseEntity<Map<String, Object>> buildErrorResponse(String message, HttpStatus status) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("timestamp", LocalDateTime.now().toString());
        errorResponse.put("status", status.value());
        errorResponse.put("error", status.getReasonPhrase());
        errorResponse.put("message", message);
        
        log.debug("Error response built - status: {}, message: {}", status.value(), message);
        
        return new ResponseEntity<>(errorResponse, status);
    }
}
