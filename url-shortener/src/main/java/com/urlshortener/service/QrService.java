package com.urlshortener.service;

import com.urlshortener.dto.QrRequest;
import com.urlshortener.dto.ShortenRequest;
import com.urlshortener.dto.ShortenResponse;
import com.urlshortener.qr.QrGenerator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Service for QR code generation operations.
 * Reuses existing URL shortening logic from UrlShortenerService.
 */
@Service
public class QrService {

    private static final Logger log = LoggerFactory.getLogger(QrService.class);

    @Autowired
    private UrlShortenerService urlShortenerService;

    @Autowired
    private QrGenerator qrGenerator;

    /**
     * Generates a QR code for a given URL.
     * First shortens the URL using the existing service, then generates QR code from the short URL.
     *
     * @param request The QR request containing the URL and optional size
     * @return byte array containing the PNG image data
     */
    public byte[] generateQrCode(QrRequest request) {
        log.info("========== QR CODE GENERATION REQUEST ==========");
        log.info("Original URL: {}", request.getUrl());
        log.info("Requested size: {}", request.getSizeOrDefault());

        // Step 1: Shorten the URL using existing service
        log.debug("Step 1: Shortening URL...");
        ShortenRequest shortenRequest = new ShortenRequest();
        shortenRequest.setLongUrl(request.getUrl());
        
        ShortenResponse shortenResponse = urlShortenerService.shortenUrl(shortenRequest);
        String shortUrl = shortenResponse.getShortUrl();
        
        log.info("Short URL created: {}", shortUrl);

        // Step 2: Generate QR code from the short URL
        log.debug("Step 2: Generating QR code from short URL...");
        int size = request.getSizeOrDefault();
        byte[] qrBytes = qrGenerator.generate(shortUrl, size, size);

        log.info("QR code generated successfully");
        log.info("  Short URL encoded: {}", shortUrl);
        log.info("  Image size: {}x{} pixels", size, size);
        log.info("  File size: {} bytes", qrBytes.length);
        log.info("===============================================");

        return qrBytes;
    }
}
