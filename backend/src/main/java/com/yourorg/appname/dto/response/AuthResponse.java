package com.yourorg.appname.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String tokenType;
    private Long id;
    private String username;
    private String fullName;
    private String email;
    private String role;
    private String avatarUrl;
    private String department;
    private String blockAssigned;
    private Long studentId;
    private String rollNumber;
    private String roomNumber;
}
