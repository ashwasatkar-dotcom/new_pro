package com.yourorg.appname.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceResponse {
    private Long id;
    private Long studentId;
    private String studentName;
    private String rollNumber;
    private String roomNumber;
    private String wing;
    private Integer floor;
    private String bedNumber;
    private String avatarUrl;
    private LocalDate recordDate;
    private String status; // 'PRESENT', 'ABSENT', 'LATE', 'LEAVE'
    private String checkInTime;
    private String remarks;
    private String markedByName;
}
