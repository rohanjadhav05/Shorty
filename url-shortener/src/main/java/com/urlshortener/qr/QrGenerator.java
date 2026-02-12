package com.urlshortener.qr;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * Component for generating QR code images using ZXing library.
 */
@Component
public class QrGenerator {

    private static final Logger log = LoggerFactory.getLogger(QrGenerator.class);
    private static final String IMAGE_FORMAT = "PNG";

    /**
     * Generates a QR code image as PNG bytes.
     *
     * @param content The content to encode in the QR code (typically a URL)
     * @param width   The width of the QR code image in pixels
     * @param height  The height of the QR code image in pixels
     * @return byte array containing the PNG image data
     * @throws QrGenerationException if QR code generation fails
     */
    public byte[] generate(String content, int width, int height) {
        log.info("Generating QR code for content: {}", content);
        log.debug("QR code dimensions: {}x{}", width, height);

        try {
            // Configure QR code hints for better quality
            Map<EncodeHintType, Object> hints = new HashMap<>();
            hints.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.H);
            hints.put(EncodeHintType.CHARACTER_SET, "UTF-8");
            hints.put(EncodeHintType.MARGIN, 2);

            // Generate QR code matrix
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(content, BarcodeFormat.QR_CODE, width, height, hints);

            // Convert to PNG bytes
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, IMAGE_FORMAT, outputStream);

            byte[] qrBytes = outputStream.toByteArray();
            log.info("QR code generated successfully, size: {} bytes", qrBytes.length);

            return qrBytes;

        } catch (WriterException e) {
            log.error("Failed to encode QR code: {}", e.getMessage());
            throw new QrGenerationException("Failed to generate QR code: " + e.getMessage(), e);
        } catch (IOException e) {
            log.error("Failed to write QR code image: {}", e.getMessage());
            throw new QrGenerationException("Failed to write QR code image: " + e.getMessage(), e);
        }
    }

    /**
     * Generates a QR code with default size (300x300).
     *
     * @param content The content to encode in the QR code
     * @return byte array containing the PNG image data
     */
    public byte[] generate(String content) {
        return generate(content, 300, 300);
    }

    /**
     * Exception thrown when QR code generation fails.
     */
    public static class QrGenerationException extends RuntimeException {
        public QrGenerationException(String message, Throwable cause) {
            super(message, cause);
        }
    }
}
