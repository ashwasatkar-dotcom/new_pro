package com.yourorg.appname.service;

import com.yourorg.appname.dto.response.DashboardStatsResponse;

public interface DashboardService {
    DashboardStatsResponse getWardenStats();
    DashboardStatsResponse getStudentStats(String username);
}
