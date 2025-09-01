package org.example.imageservice.util;
/** Simple in-memory image payload + mime type. */
public record ImageResponse(
        String contentType,
        byte[] bytes
) {}
