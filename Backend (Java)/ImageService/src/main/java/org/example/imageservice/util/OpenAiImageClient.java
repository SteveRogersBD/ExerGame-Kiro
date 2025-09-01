package org.example.imageservice.util;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.example.imageservice.GenerateRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import java.net.URI;
import java.util.Base64;

@Service
@RequiredArgsConstructor
public class OpenAiImageClient {

    private final WebClient openAiWebClient;
    private final ObjectMapper om = new ObjectMapper();

    @Value("${openai.default.size:1024x1024}")
    private String defaultSize;

    @Value("${openai.default.quality:standard}")
    private String defaultQuality;

    // --- DALL·E 3 text -> image ---
    public ImageResponse generate(GenerateRequest req) {
        String size = StringUtils.hasText(req.size()) ? req.size() : defaultSize;
        String quality = StringUtils.hasText(req.quality()) ? req.quality() : defaultQuality;

        JsonNode response = openAiWebClient.post()
                .uri("/images/generations")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue("""
          {
            "model": "dall-e-3",
            "prompt": %s,
            "size": %s,
            "quality": %s,
            "n": 1,
            "response_format": "b64_json"
          }
        """.formatted(json(req.prompt()), json(size), json(quality)))
                .retrieve()
                .bodyToMono(JsonNode.class)
                .block();

        String b64 = response.get("data").get(0).get("b64_json").asText();
        byte[] bytes = Base64.getDecoder().decode(b64);
        return new ImageResponse("image/png", bytes);
    }

    // --- GPT-Image-1 image edit: cartoonize existing image from bytes ---
    public ImageResponse cartoonize(byte[] imageBytes, String prompt, String sizeOpt) {
        String size = StringUtils.hasText(sizeOpt) ? sizeOpt : defaultSize;

        MultipartBodyBuilder mb = new MultipartBodyBuilder();
        mb.part("model", "gpt-image-1");
        mb.part("prompt", prompt);
        mb.part("size", size);
        mb.part("image", new ByteArrayResource(imageBytes) {
            @Override public String getFilename() { return "input.png"; }
        }).filename("input.png").contentType(MediaType.IMAGE_PNG);

        JsonNode response = openAiWebClient.post()
                .uri("/images/edits")
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .body(BodyInserters.fromMultipartData(mb.build()))
                .retrieve()
                .bodyToMono(JsonNode.class)
                .block();

        String b64 = response.get("data").get(0).get("b64_json").asText();
        byte[] bytes = Base64.getDecoder().decode(b64);
        return new ImageResponse("image/png", bytes);
    }

    // convenience: fetch remote image bytes (for cartoonize-url)
    public byte[] fetchUrl(String url) {
        return openAiWebClient.mutate().baseUrl("") // raw client
                .build()
                .get()
                .uri(URI.create(url))
                .retrieve()
                .bodyToMono(byte[].class)
                .block();
    }

    // tiny helper to json-escape strings
    private static String json(String s) {
        try {
            return new ObjectMapper().writeValueAsString(s);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
