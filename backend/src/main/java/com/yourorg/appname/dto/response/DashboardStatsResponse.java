package com.yourorg.appname.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsResponse {
    // Facility Telemetry (Warden)
    private long totalStudents;
    private long totalRooms;
    private long occupiedRooms;
    private long availableRooms;
    private BigDecimal paidFees;
    private BigDecimal pendingFees;
    private long pendingFeesCount;
    private long presentToday;
    private double attendanceRateToday;
    private long openComplaintsCount;

    // Student Telemetry (if queried by or for student)
    private StudentResponse studentProfile;
    private RoomResponse roomDetails;
    private List<StudentResponse> roommates;
    private List<ComplaintResponse> recentComplaints;
    private List<FeeInvoiceResponse> recentInvoices;
}
