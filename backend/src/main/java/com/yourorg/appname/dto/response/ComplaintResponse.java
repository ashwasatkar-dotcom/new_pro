package com.yourorg.appname.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ComplaintResponse {
    private Long id;
    private String ticketNumber;
    private Long studentId;
    private String studentName;
    private String studentRollNumber;
    private String studentAvatarUrl;
    private Long roomId;
    private String roomNumber;
    private String wing;
    private String title;
    private String description;
    private String category;
    private String priority;
    private String status;
    private String assignedStaff;
    private String resolutionNotes;
    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;
}
