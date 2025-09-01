package org.example.emailservice.messaging;


import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitConfig {

    public static final String QUEUE = "user.registered";
    public static final String POST_QUEUE = "post.created";
    public static final String COMMENT_QUEUE = "comment.created";

    @Bean
    public Queue queue() {
        return new Queue(QUEUE);
    }
    @Bean
    public Queue postQueue() {
        return new Queue(POST_QUEUE);
    }

    @Bean
    public Queue commentQueue() {
        return new Queue(COMMENT_QUEUE);
    }




    @Bean
    public MessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(messageConverter());
        return rabbitTemplate;
    }
}
