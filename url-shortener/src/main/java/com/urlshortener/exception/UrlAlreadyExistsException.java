package com.urlshortener.exception;

import com.urlshortener.model.Url;

public class UrlAlreadyExistsException extends RuntimeException {
  private final Url existingUrl;

  public UrlAlreadyExistsException(Url existingUrl) {
    super("Long URL already exists");
    this.existingUrl = existingUrl;
  }

  public Url getExistingUrl() {
    return existingUrl;
  }
}
