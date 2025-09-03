package com.example.UserService;

import com.example.UserService.dto.response.UserResponse;
import com.example.UserService.entity.User;

import java.util.ArrayList;

public class UserUtil {

    public static UserResponse transformToResponse(User user)
    {
        UserResponse userResponse = new UserResponse();
        userResponse.setId(user.getId());
        userResponse.setFullName(user.getFullName());
        userResponse.setUsername(user.getUsername());
        userResponse.setEmail(user.getEmail());
        userResponse.setRole(user.getRole());
        userResponse.setCreatedAt(user.getCreatedAt());
        return userResponse;
    }

//    public static UserDTO transformToDTO(User user)
//    {
//        UserDTO userDTO = new UserDTO();
//        userDTO.setId(user.getId());
//        userDTO.setUsername(user.getUsername());
//        userDTO.setEmail(user.getEmail());
//        userDTO.setDp(user.getDp());
//        userDTO.setRole(user.getRole());
//        return userDTO;
//    }
}
