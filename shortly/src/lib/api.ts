import axios, { AxiosError, AxiosInstance } from 'axios';
import { ShortenRequest, ShortenResponse, UrlStatsResponse, ApiError } from './types';

/**
 * Axios instance configured with the backend base URL
 * Reads from environment variable for flexibility across environments
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

/**
 * Extracts a user-friendly error message from API errors
 */
function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>;
    
    // Handle specific HTTP status codes
    if (axiosError.response) {
      const { status, data } = axiosError.response;
      
      switch (status) {
        case 400:
          return data?.message || 'Invalid request. Please check your input.';
        case 404:
          return 'URL not found.';
        case 410:
          return 'This URL has expired.';
        case 409:
          return data?.message || 'This custom alias is already taken.';
        case 500:
          return 'Server error. Please try again later.';
        default:
          return data?.message || 'An unexpected error occurred.';
      }
    }
    
    // Network errors
    if (axiosError.code === 'ECONNABORTED') {
      return 'Request timed out. Please try again.';
    }
    
    if (!axiosError.response) {
      return 'Unable to connect to the server. Please check your internet connection.';
    }
  }
  
  return 'An unexpected error occurred. Please try again.';
}

/**
 * Creates a shortened URL
 * @param request - The shorten request containing the long URL and optional parameters
 * @returns The shorten response with the short URL details
 * @throws ApiError if the request fails
 */
export async function shortenUrl(request: ShortenRequest): Promise<ShortenResponse> {
  try {
    const response = await apiClient.post<ShortenResponse>('/api/shorten', request);
    return response.data;
  } catch (error) {
    const message = extractErrorMessage(error);
    throw { message } as ApiError;
  }
}

/**
 * Gets the original long URL for a short code
 * @param shortCode - The short code to look up
 * @returns The original long URL
 * @throws ApiError if the request fails
 */
export async function getLongUrl(shortCode: string): Promise<string> {
  try {
    const response = await apiClient.get<string>(`/api/url/${shortCode}`);
    return response.data;
  } catch (error) {
    const message = extractErrorMessage(error);
    throw { message } as ApiError;
  }
}

/**
 * Gets statistics for a shortened URL
 * @param shortCode - The short code to get statistics for
 * @returns The URL statistics including click count
 * @throws ApiError if the request fails
 */
export async function getUrlStats(shortCode: string): Promise<UrlStatsResponse> {
  try {
    const response = await apiClient.get<UrlStatsResponse>(`/api/stats/${shortCode}`);
    return response.data;
  } catch (error) {
    const message = extractErrorMessage(error);
    throw { message } as ApiError;
  }
}

/**
 * Deletes a shortened URL
 * @param shortCode - The short code of the URL to delete
 * @throws ApiError if the request fails
 */
export async function deleteUrl(shortCode: string): Promise<void> {
  try {
    await apiClient.delete(`/api/url/${shortCode}`);
  } catch (error) {
    const message = extractErrorMessage(error);
    throw { message } as ApiError;
  }
}

/**
 * Checks if the API is healthy
 * @returns true if the API is running
 */
export async function healthCheck(): Promise<boolean> {
  try {
    const response = await apiClient.get<string>('/health');
    return response.status === 200;
  } catch {
    return false;
  }
}
