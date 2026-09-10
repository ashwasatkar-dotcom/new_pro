package com.yourorg.appname.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ComplaintRequest {
    private Long studentId;
    private Long roomId;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Category is required")
    private String category; // 'Plumbing', 'Electrical', 'WiFi', 'Cleanliness', 'Carpentry', 'Discipline'

    private String priority; // 'LOW', 'MEDIUM', 'HIGH', 'URGENT'
    private String status;   // 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'
    private String assignedStaff;
    private String resolutionNotes;
}
