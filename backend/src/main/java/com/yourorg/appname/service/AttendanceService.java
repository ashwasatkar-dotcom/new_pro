package com.yourorg.appname.service;

import com.yourorg.appname.dto.request.AttendanceBatchRequest;
import com.yourorg.appname.dto.request.AttendanceRequest;
import com.yourorg.appname.dto.response.AttendanceResponse;
import java.time.LocalDate;
import java.util.List;

public interface AttendanceService {
    List<AttendanceResponse> getAttendanceByDate(LocalDate date, String wing, Integer floor);
    List<AttendanceResponse> getStudentAttendanceHistory(Long studentId);
    AttendanceResponse markAttendance(AttendanceRequest request, String markedByUsername);
    List<AttendanceResponse> markBatchAttendance(AttendanceBatchRequest batchRequest, String markedByUsername);
}
