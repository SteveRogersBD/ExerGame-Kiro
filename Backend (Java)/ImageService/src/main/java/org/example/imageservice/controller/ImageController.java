package org.example.imageservice.controller;


import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.imageservice.GenerateRequest;
import org.example.imageservice.util.CartoonizeUrlRequest;
import org.example.imageservice.util.ImageResponse;
import org.example.imageservice.util.OpenAiImageClient;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MimeTypeUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/images")
@RequiredArgsConstructor
public class ImageController {

    private final OpenAiImageClient client;

    @PostMapping("/generate")
    public ResponseEntity<byte[]> generate(@Valid @RequestBody GenerateRequest req) {
        ImageResponse out = client.generate(req);
        return imageResponse(out, "generated.png");
    }

    @PostMapping("/cartoonize-url")
    public ResponseEntity<byte[]> cartoonizeUrl(@Valid @RequestBody CartoonizeUrlRequest req) {
        byte[] input = client.fetchUrl(req.imageUrl());
        ImageResponse out = client.cartoonize(
                input,
                // sensible default prompt for “cartoonize”
                req.prompt()
                , req.size());
        return imageResponse(out, "cartoon.png");
    }

    @PostMapping(value = "/cartoonize-upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<byte[]> cartoonizeUpload(
            @RequestPart("image") MultipartFile image,
            @RequestPart("prompt") String prompt,
            @RequestPart(value = "size", required = false) String size) throws Exception {

        ImageResponse out = client.cartoonize(image.getBytes(), prompt, size);
        return imageResponse(out, "cartoon.png");
    }

    private static ResponseEntity<byte[]> imageResponse(ImageResponse out, String filename) {
        HttpHeaders h = new HttpHeaders();
        h.setContentType(MediaType.asMediaType(MimeTypeUtils.parseMimeType(out.contentType())));
        h.setContentDisposition(ContentDisposition.inline().filename(filename).build());
        return ResponseEntity.ok().headers(h).body(out.bytes());
    }
}

