package org.example.imageservice.util;

import jakarta.validation.constraints.NotBlank;
// If you're using Hibernate Validator, you can also validate URL format:
// import org.hibernate.validator.constraints.URL;

/**
 * Request body for cartoonizing an existing image from a public URL
 * using the Images API (gpt-image-1 edits).
 *
 * size examples: "1024x1024" (optional; server can default it)
 */
public record CartoonizeUrlRequest(
        // @URL(message = "imageUrl must be a valid URL")
        @NotBlank String imageUrl,
        @NotBlank String prompt,
        String size
) {}