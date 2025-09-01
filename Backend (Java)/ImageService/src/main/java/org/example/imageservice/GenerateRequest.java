package org.example.imageservice;
import jakarta.validation.constraints.NotBlank;

/**
 * Request body for text-to-image generation (DALL·E 3).
 * size examples: "1024x1024", "1024x1792", "1792x1024"
 * quality: "standard" or "hd" (optional; defaults server-side)
 */
public record GenerateRequest(
        @NotBlank String prompt,
        String size,
        String quality
) {}