package org.example.emailservice.messaging;


import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;

@Service
public class MessageSender {

    @Autowired
    private EmailService mailSender;
    @RabbitListener(queues = "user.registered")
    public void receiveMessage(EmailRequest emailRequest) {
        //send email
        System.out.println("Received message: " + emailRequest.getTo());
        mailSender.sendEmail(emailRequest.getTo(),
                emailRequest.getSubject(), emailRequest.getBody());
    }

    @RabbitListener(queues = "post.created")
    public void receiveMessageAfterPost(EmailRequest emailRequest) {
        //send email
        System.out.println("Received message: " + emailRequest.getTo());
        mailSender.sendEmail(emailRequest.getTo(),
                emailRequest.getSubject(), emailRequest.getBody());
    }

    @RabbitListener(queues = "comment.created")
    public void receiveMessageAfterComment(EmailRequest emailRequest) {
        //send email
        System.out.println("Received message: " + emailRequest.getTo());
        mailSender.sendEmail(emailRequest.getTo(),
                emailRequest.getSubject(), emailRequest.getBody());
    }
}
