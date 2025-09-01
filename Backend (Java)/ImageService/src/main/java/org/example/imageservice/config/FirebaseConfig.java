package org.example.imageservice.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;
import java.io.FileInputStream;
import java.io.IOException;

@Configuration
public class FirebaseConfig {

    @PostConstruct
    public void initializeFirebase() throws IOException {
        // Initialize Firebase only once
        if (FirebaseApp.getApps().isEmpty()) { // Check if Firebase is already initialized
            FileInputStream serviceAccount =
                    new FileInputStream("D:\\KiroHackathon\\Backend (Java)\\ImageService\\atomica-cbcd3-firebase-adminsdk-ca3ot-60097558fe.json");
            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .setStorageBucket("atomica-cbcd3.firebasestorage.app")
                    .build();
            FirebaseApp.initializeApp(options); // Initialize the default FirebaseApp
        }
    }
}
