/**
 * TypeScript interfaces for Shortly API
 * Based on the Spring Boot backend DTOs
 */

/**
 * Request payload for creating a shortened URL
 */
export interface ShortenRequest {
  /** The long URL to shorten (required) */
  longUrl: string;
  /** Custom alias for the short URL (optional, 3-20 alphanumeric chars) */
  customAlias?: string;
  /** Number of days until the URL expires (optional, positive integer) */
  expirationDays?: number;
}

/**
 * Response from the shorten URL endpoint
 */
export interface ShortenResponse {
  /** The complete short URL (e.g., https://shortly.com/ABC1234) */
  shortUrl: string;
  /** The short code (e.g., ABC1234) */
  shortCode: string;
  /** The original long URL */
  longUrl: string;
  /** When the short URL was created (ISO 8601 format) */
  createdAt: string;
  /** When the short URL expires, null if no expiration (ISO 8601 format) */
  expiresAt: string | null;
}

/**
 * Response containing URL statistics
 */
export interface UrlStatsResponse {
  /** The short code */
  shortCode: string;
  /** The original long URL */
  longUrl: string;
  /** Number of times the short URL has been accessed */
  clickCount: number;
  /** When the short URL was created (ISO 8601 format) */
  createdAt: string;
  /** When the short URL expires, null if no expiration (ISO 8601 format) */
  expiresAt: string | null;
}

/**
 * API error response structure
 */
export interface ApiError {
  message: string;
  status?: number;
}
