package com.yourorg.appname.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class StudentRequest {
    @NotBlank(message = "Roll number is required")
    private String rollNumber;

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Phone is required")
    private String phone;

    private Long roomId;
    private String bedNumber;
    private String department;
    private String academicYear;
    private String guardianName;
    private String guardianPhone;
    private BigDecimal attendanceRate;
    private String feeStatus; // 'PAID', 'PENDING', 'OVERDUE'
    private String status;    // 'ACTIVE', 'ON_LEAVE', 'SUSPENDED'
    private String avatarUrl;
}
