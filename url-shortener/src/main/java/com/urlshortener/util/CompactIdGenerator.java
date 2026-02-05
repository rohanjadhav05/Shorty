package com.urlshortener.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.concurrent.locks.ReentrantLock;

/**
 * Compact ID Generator using a Snowflake-inspired algorithm.
 * Generates 42-bit IDs encoded as 7-character Base62 strings.
 * 
 * ID Structure (42 bits total):
 * - 28 bits: Timestamp in seconds since EPOCH (good for ~8.5 years)
 * - 8 bits: Machine ID (0-255)
 * - 6 bits: Sequence number (0-63)
 * 
 * Capacity: 64 IDs/second × 256 machines = 16,384 IDs/second
 */
public class CompactIdGenerator {

    private static final Logger log = LoggerFactory.getLogger(CompactIdGenerator.class);

    private static final String BASE62_ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    private static final int BASE62_LENGTH = 62;
    private static final int SHORT_CODE_LENGTH = 7;

    // EPOCH: 2024-01-01 00:00:00 UTC in seconds
    private static final long EPOCH = 1704067200L;

    // Bit allocations
    private static final int TIMESTAMP_BITS = 28;
    private static final int MACHINE_ID_BITS = 8;
    private static final int SEQUENCE_BITS = 6;

    // Max values
    private static final int MAX_MACHINE_ID = (1 << MACHINE_ID_BITS) - 1; // 255
    private static final int MAX_SEQUENCE = (1 << SEQUENCE_BITS) - 1; // 63

    // Bit shifts
    private static final int MACHINE_ID_SHIFT = SEQUENCE_BITS;
    private static final int TIMESTAMP_SHIFT = SEQUENCE_BITS + MACHINE_ID_BITS;

    private final int machineId;
    private long lastTimestamp = -1L;
    private int sequence = 0;
    private final ReentrantLock lock = new ReentrantLock();
    private long totalIdsGenerated = 0;

    /**
     * Creates a new CompactIdGenerator with the specified machine ID.
     *
     * @param machineId The machine ID (0-255)
     * @throws IllegalArgumentException if machineId is out of range
     */
    public CompactIdGenerator(int machineId) {
        if (machineId < 0 || machineId > MAX_MACHINE_ID) {
            log.error("Invalid machine ID: {} (must be 0-{})", machineId, MAX_MACHINE_ID);
            throw new IllegalArgumentException(
                    String.format("Machine ID must be between 0 and %d, got %d", MAX_MACHINE_ID, machineId));
        }
        this.machineId = machineId;
        log.info("CompactIdGenerator initialized - Machine ID: {}, Max sequence: {}/second", machineId, MAX_SEQUENCE + 1);
    }

    /**
     * Generates a unique 7-character Base62 ID.
     *
     * @return A 7-character Base62 encoded string
     * @throws IllegalStateException if clock moves backwards
     */
    public String generateBase62Id() {
        long id = nextId();
        String base62Id = encodeBase62(id);
        log.debug("Generated ID - numeric: {}, base62: {}, sequence: {}, total generated: {}", 
                id, base62Id, sequence, totalIdsGenerated);
        return base62Id;
    }

    /**
     * Generates the next unique 42-bit ID.
     *
     * @return A unique 42-bit ID
     * @throws IllegalStateException if clock moves backwards
     */
    private long nextId() {
        lock.lock();
        try {
            long currentTimestamp = getCurrentTimestamp();

            // Handle clock moving backwards
            if (currentTimestamp < lastTimestamp) {
                long diff = lastTimestamp - currentTimestamp;
                log.error("CRITICAL: Clock moved backwards by {} seconds! Last: {}, Current: {}", 
                        diff, lastTimestamp, currentTimestamp);
                throw new IllegalStateException(
                        String.format("Clock moved backwards. Refusing to generate ID for %d seconds", diff));
            }

            if (currentTimestamp == lastTimestamp) {
                // Same second, increment sequence
                sequence = (sequence + 1) & MAX_SEQUENCE;
                if (sequence == 0) {
                    // Sequence exhausted, wait for next second
                    log.warn("Sequence exhausted ({} IDs in this second), waiting for next second...", MAX_SEQUENCE + 1);
                    currentTimestamp = waitForNextSecond(currentTimestamp);
                    log.debug("Resumed at timestamp: {}", currentTimestamp);
                }
            } else {
                // New second, reset sequence
                if (sequence > 0) {
                    log.debug("New second started - previous second generated {} IDs", sequence);
                }
                sequence = 0;
            }

            lastTimestamp = currentTimestamp;
            totalIdsGenerated++;

            // Build the 42-bit ID
            return ((currentTimestamp - EPOCH) << TIMESTAMP_SHIFT)
                    | ((long) machineId << MACHINE_ID_SHIFT)
                    | sequence;
        } finally {
            lock.unlock();
        }
    }

    /**
     * Gets the current timestamp in seconds.
     *
     * @return Current timestamp in seconds since Unix epoch
     */
    private long getCurrentTimestamp() {
        return System.currentTimeMillis() / 1000;
    }

    /**
     * Waits for the next second when sequence is exhausted.
     *
     * @param currentTimestamp The current timestamp to wait past
     * @return The next timestamp
     */
    private long waitForNextSecond(long currentTimestamp) {
        long timestamp = getCurrentTimestamp();
        int waitCount = 0;
        while (timestamp <= currentTimestamp) {
            try {
                Thread.sleep(10); // Sleep 10ms and check again
                waitCount++;
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                log.error("Thread interrupted while waiting for next second after {} attempts", waitCount);
                throw new IllegalStateException("Thread interrupted while waiting for next second", e);
            }
            timestamp = getCurrentTimestamp();
        }
        log.debug("Waited {} ms for next second", waitCount * 10);
        return timestamp;
    }

    /**
     * Encodes a 42-bit ID as a 7-character Base62 string.
     * Pads with leading zeros to ensure exactly 7 characters.
     *
     * @param id The ID to encode
     * @return A 7-character Base62 string
     */
    private String encodeBase62(long id) {
        StringBuilder sb = new StringBuilder(SHORT_CODE_LENGTH);

        // Convert to Base62
        while (id > 0) {
            sb.append(BASE62_ALPHABET.charAt((int) (id % BASE62_LENGTH)));
            id /= BASE62_LENGTH;
        }

        // Pad with leading zeros to ensure 7 characters
        while (sb.length() < SHORT_CODE_LENGTH) {
            sb.append(BASE62_ALPHABET.charAt(0));
        }

        // Reverse to get correct order
        return sb.reverse().toString();
    }

    /**
     * Gets the machine ID for this generator.
     *
     * @return The machine ID
     */
    public int getMachineId() {
        return machineId;
    }

    /**
     * Gets the total number of IDs generated by this instance.
     *
     * @return Total IDs generated
     */
    public long getTotalIdsGenerated() {
        return totalIdsGenerated;
    }
}
