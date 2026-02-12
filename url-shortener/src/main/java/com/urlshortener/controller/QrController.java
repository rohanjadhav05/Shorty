package com.urlshortener.controller;

import com.urlshortener.dto.QrRequest;
import com.urlshortener.service.QrService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

/**
 * REST Controller for QR code generation operations.
 */
@RestController
@RequestMapping("/api/qr")
@Tag(name = "QR Code", description = "APIs for QR code generation")
@CrossOrigin("*")
public class QrController {

    private static final Logger log = LoggerFactory.getLogger(QrController.class);

    @Autowired
    private QrService qrService;

    @Operation(summary = "Generate QR Code",
            description = "Generates a QR code PNG image from a URL. The URL is first shortened, then encoded into the QR code.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "QR code generated successfully",
                    content = @Content(mediaType = "image/png",
                            schema = @Schema(type = "string", format = "binary"))),
            @ApiResponse(responseCode = "400", description = "Invalid URL format"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping(value = "/generate", produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<byte[]> generateQrCode(@Valid @RequestBody QrRequest request) {
        log.debug("[POST /api/qr/generate] Request - URL: {}, Size: {}", 
                request.getUrl(), request.getSize());

        long startTime = System.currentTimeMillis();
        
        // Generate QR code
        byte[] qrImage = qrService.generateQrCode(request);
        
        long duration = System.currentTimeMillis() - startTime;
        log.info("[POST /api/qr/generate] QR code generated in {} ms, size: {} bytes", 
                duration, qrImage.length);

        // Build response with appropriate headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_PNG);
        headers.setContentLength(qrImage.length);
        headers.setContentDispositionFormData("attachment", "qr.png");

        return new ResponseEntity<>(qrImage, headers, HttpStatus.OK);
    }
}
