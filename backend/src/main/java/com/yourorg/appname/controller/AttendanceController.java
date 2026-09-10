package com.yourorg.appname.controller;

import com.yourorg.appname.dto.request.AttendanceBatchRequest;
import com.yourorg.appname.dto.request.AttendanceRequest;
import com.yourorg.appname.dto.response.ApiResponse;
import com.yourorg.appname.dto.response.AttendanceResponse;
import com.yourorg.appname.service.AttendanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AttendanceResponse>>> getAttendanceByDate(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) String wing,
            @RequestParam(required = false) Integer floor) {
        List<AttendanceResponse> records = attendanceService.getAttendanceByDate(date, wing, floor);
        return ResponseEntity.ok(ApiResponse.success(records));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<ApiResponse<List<AttendanceResponse>>> getStudentAttendance(@PathVariable Long studentId) {
        List<AttendanceResponse> records = attendanceService.getStudentAttendanceHistory(studentId);
        return ResponseEntity.ok(ApiResponse.success(records));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AttendanceResponse>> markAttendance(
            @Valid @RequestBody AttendanceRequest request,
            Authentication authentication) {
        String username = authentication != null ? authentication.getName() : null;
        AttendanceResponse response = attendanceService.markAttendance(request, username);
        return ResponseEntity.ok(ApiResponse.success("Attendance recorded", response));
    }

    @PostMapping("/batch")
    public ResponseEntity<ApiResponse<List<AttendanceResponse>>> markBatchAttendance(
            @Valid @RequestBody AttendanceBatchRequest batchRequest,
            Authentication authentication) {
        String username = authentication != null ? authentication.getName() : null;
        List<AttendanceResponse> response = attendanceService.markBatchAttendance(batchRequest, username);
        return ResponseEntity.ok(ApiResponse.success("Batch attendance recorded", response));
    }
}
