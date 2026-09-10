package com.yourorg.appname.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentResponse {
    private Long id;
    private Long userId;
    private String rollNumber;
    private String fullName;
    private String email;
    private String phone;
    private Long roomId;
    private String roomNumber;
    private String wing;
    private Integer floor;
    private String bedNumber;
    private String department;
    private String academicYear;
    private String guardianName;
    private String guardianPhone;
    private BigDecimal attendanceRate;
    private String feeStatus;
    private String status;
    private String avatarUrl;
    private LocalDateTime createdAt;
}
