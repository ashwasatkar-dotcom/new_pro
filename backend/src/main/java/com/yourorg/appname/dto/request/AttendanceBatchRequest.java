package com.yourorg.appname.dto.request;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class AttendanceBatchRequest {
    private LocalDate recordDate;
    
    @NotEmpty(message = "Attendance items cannot be empty")
    private List<AttendanceRequest> items;
}
