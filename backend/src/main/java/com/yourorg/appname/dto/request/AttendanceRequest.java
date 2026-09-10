package com.yourorg.appname.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class AttendanceRequest {
    @NotNull(message = "Student ID is required")
    private Long studentId;

    private LocalDate recordDate;
    private String status; // 'PRESENT', 'ABSENT', 'LATE', 'LEAVE'
    private String checkInTime;
    private String remarks;
}
