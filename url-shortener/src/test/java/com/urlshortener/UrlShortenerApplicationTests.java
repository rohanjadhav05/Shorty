package com.urlshortener;

import com.urlshortener.util.CompactIdGenerator;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.HashSet;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Tests for the URL Shortener application.
 */
class UrlShortenerApplicationTests {

    @Test
    void contextLoads() {
        // Basic test to verify the application context can load
    }

    @Test
    void testIdGeneratorProduces7CharacterIds() {
        CompactIdGenerator generator = new CompactIdGenerator(1);
        String id = generator.generateBase62Id();
        
        assertNotNull(id);
        assertEquals(7, id.length(), "ID should be exactly 7 characters");
    }

    @Test
    void testIdGeneratorProducesUniqueIds() {
        CompactIdGenerator generator = new CompactIdGenerator(1);
        Set<String> ids = new HashSet<>();
        
        // Generate 100 IDs and verify uniqueness
        for (int i = 0; i < 100; i++) {
            String id = generator.generateBase62Id();
            assertTrue(ids.add(id), "ID should be unique: " + id);
        }
        
        assertEquals(100, ids.size());
    }

    @Test
    void testIdGeneratorRejectInvalidMachineId() {
        assertThrows(IllegalArgumentException.class, () -> new CompactIdGenerator(-1));
        assertThrows(IllegalArgumentException.class, () -> new CompactIdGenerator(256));
    }

    @Test
    void testIdGeneratorAcceptsValidMachineId() {
        assertDoesNotThrow(() -> new CompactIdGenerator(0));
        assertDoesNotThrow(() -> new CompactIdGenerator(255));
        assertDoesNotThrow(() -> new CompactIdGenerator(128));
    }

    @Test
    void testBase62AlphabetUsed() {
        CompactIdGenerator generator = new CompactIdGenerator(1);
        String id = generator.generateBase62Id();
        
        // Verify all characters are valid Base62
        String base62Alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        for (char c : id.toCharArray()) {
            assertTrue(base62Alphabet.indexOf(c) >= 0, 
                "Character '" + c + "' should be in Base62 alphabet");
        }
    }
}
