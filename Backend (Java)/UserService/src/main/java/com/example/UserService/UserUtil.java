package com.example.UserService;

import java.util.ArrayList;

public class UserUtil {

    public static UserResponse transformToResponse(User user)
    {
        UserResponse userResponse = new UserResponse();
        userResponse.setId(user.getId());
        userResponse.setUsername(user.getUsername());
        userResponse.setPassword(user.getPassword());
        userResponse.setEmail(user.getEmail());
        userResponse.setRole(user.getRole());
        userResponse.setDp(user.getDp());
        userResponse.setAbout(user.getAbout());
        userResponse.setCreatedAt(user.getCreatedAt());
        userResponse.setPosts(new ArrayList<>());
        userResponse.setComments(new ArrayList<>());
        return userResponse;
    }

    public static UserDTO transformToDTO(User user)
    {
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setUsername(user.getUsername());
        userDTO.setEmail(user.getEmail());
        userDTO.setDp(user.getDp());
        userDTO.setRole(user.getRole());
        return userDTO;
    }
}
