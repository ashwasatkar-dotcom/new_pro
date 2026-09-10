package com.yourorg.appname.controller;

import com.yourorg.appname.dto.response.ApiResponse;
import com.yourorg.appname.dto.response.DashboardStatsResponse;
import com.yourorg.appname.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/warden")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getWardenDashboard() {
        DashboardStatsResponse stats = dashboardService.getWardenStats();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping("/student")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getStudentDashboard(Authentication authentication) {
        String username = authentication != null ? authentication.getName() : "STU-2024-089";
        DashboardStatsResponse stats = dashboardService.getStudentStats(username);
        return ResponseEntity.ok(ApiResponse.success(stats));
    }
}
