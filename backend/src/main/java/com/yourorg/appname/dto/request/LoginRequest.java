package com.yourorg.appname.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    @NotBlank(message = "Username or ID is required")
    private String username;

    @NotBlank(message = "Password is required")
    private String password;

    private String role; // Optional hint: 'warden' or 'student'
}
