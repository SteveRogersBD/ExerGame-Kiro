package org.example.imageservice.service;

import com.google.cloud.storage.Blob;
import com.google.cloud.storage.Bucket;
import com.google.firebase.cloud.StorageClient;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.UUID;

@Service
public class FirebaseStorageService {

    public String uploadFile(MultipartFile file) throws IOException {
        // Validate the file
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be null or empty");
        }

        // Generate a unique filename
        String fileName = UUID.randomUUID().toString() + "-" + file.getOriginalFilename();

        // Get the bucket
        Bucket bucket = StorageClient.getInstance().bucket();
        if (bucket == null) {
            throw new IllegalStateException("Unable to access Firebase bucket");
        }

        // Upload the file
        Blob blob = bucket.create(fileName, file.getBytes(), file.getContentType());

        // URL-encode the filename
        String encodedFileName = URLEncoder.encode(fileName, StandardCharsets.UTF_8.toString());

        // Generate the correct URL for the uploaded file
        String fileUrl = String.format(
                "https://firebasestorage.googleapis.com/v0/b/%s/o/%s?alt=media",
                bucket.getName(),
                encodedFileName
        );

        return fileUrl;
    }

}
