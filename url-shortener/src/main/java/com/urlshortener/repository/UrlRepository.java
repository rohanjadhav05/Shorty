package com.urlshortener.repository;

import com.urlshortener.model.Url;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * MongoDB repository for URL operations.
 */
@Repository
public interface UrlRepository extends MongoRepository<Url, String> {

    /**
     * Finds a URL by its short code.
     *
     * @param shortCode The short code to search for
     * @return An Optional containing the URL if found
     */
    Optional<Url> findByShortCode(String shortCode);

    /**
     * Finds a URL by its long URL.
     *
     * @param longUrl The long URL to search for
     * @return An Optional containing the URL if found
     */
    Optional<Url> findByLongUrl(String longUrl);

    /**
     * Checks if a short code already exists.
     *
     * @param shortCode The short code to check
     * @return true if the short code exists, false otherwise
     */
    boolean existsByShortCode(String shortCode);

    /**
     * Deletes a URL by its short code.
     *
     * @param shortCode The short code of the URL to delete
     */
    void deleteByShortCode(String shortCode);
}
