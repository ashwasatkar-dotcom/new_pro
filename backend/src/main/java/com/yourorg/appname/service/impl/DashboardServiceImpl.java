package com.yourorg.appname.service.impl;

import com.yourorg.appname.dto.response.*;
import com.yourorg.appname.entity.Room;
import com.yourorg.appname.entity.Student;
import com.yourorg.appname.entity.User;
import com.yourorg.appname.exception.ResourceNotFoundException;
import com.yourorg.appname.mapper.EntityMapper;
import com.yourorg.appname.repository.*;
import com.yourorg.appname.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final StudentRepository studentRepository;
    private final RoomRepository roomRepository;
    private final AttendanceRecordRepository attendanceRecordRepository;
    private final ComplaintRepository complaintRepository;
    private final FeeInvoiceRepository feeInvoiceRepository;
    private final UserRepository userRepository;
    private final EntityMapper mapper;

    @Override
    public DashboardStatsResponse getWardenStats() {
        long totalStudents = studentRepository.count();
        long totalRooms = roomRepository.count();

        List<Room> allRooms = roomRepository.findAll();
        long occupiedRooms = allRooms.stream()
                .filter(r -> "FULL".equalsIgnoreCase(r.getStatus()) || "PARTIALLY_OCCUPIED".equalsIgnoreCase(r.getStatus()))
                .count();
        long availableRooms = allRooms.stream()
                .filter(r -> "AVAILABLE".equalsIgnoreCase(r.getStatus()))
                .count();

        BigDecimal paidFees = feeInvoiceRepository.sumTotalPaidFees();
        BigDecimal pendingFees = feeInvoiceRepository.sumTotalPendingFees();
        long pendingFeesCount = feeInvoiceRepository.countByStatus("PENDING") + feeInvoiceRepository.countByStatus("OVERDUE");

        LocalDate today = LocalDate.now();
        long presentToday = attendanceRecordRepository.countByRecordDateAndStatus(today, "PRESENT");
        double attendanceRate = totalStudents > 0 ? ((double) presentToday / totalStudents) * 100 : 0.0;

        long openComplaints = complaintRepository.countByStatus("OPEN") + complaintRepository.countByStatus("IN_PROGRESS");

        return DashboardStatsResponse.builder()
                .totalStudents(totalStudents)
                .totalRooms(totalRooms)
                .occupiedRooms(occupiedRooms)
                .availableRooms(availableRooms)
                .paidFees(paidFees != null ? paidFees : BigDecimal.ZERO)
                .pendingFees(pendingFees != null ? pendingFees : BigDecimal.ZERO)
                .pendingFeesCount(pendingFeesCount)
                .presentToday(presentToday)
                .attendanceRateToday(Math.round(attendanceRate * 10.0) / 10.0)
                .openComplaintsCount(openComplaints)
                .build();
    }

    @Override
    public DashboardStatsResponse getStudentStats(String username) {
        User user = userRepository.findByUsername(username)
                .or(() -> userRepository.findByEmail(username))
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        Student student = studentRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for user: " + username));

        StudentResponse studentProfile = mapper.toStudentResponse(student);

        RoomResponse roomResponse = null;
        List<StudentResponse> roommates = Collections.emptyList();

        if (student.getRoom() != null) {
            Room room = student.getRoom();
            List<Student> occupants = studentRepository.findByRoomId(room.getId());
            roomResponse = mapper.toRoomResponse(room, occupants);

            roommates = occupants.stream()
                    .filter(s -> !s.getId().equals(student.getId()))
                    .map(mapper::toStudentResponse)
                    .collect(Collectors.toList());
        }

        List<ComplaintResponse> complaints = complaintRepository.findByStudentIdOrderByCreatedAtDesc(student.getId())
                .stream()
                .map(mapper::toComplaintResponse)
                .limit(5)
                .collect(Collectors.toList());

        List<FeeInvoiceResponse> invoices = feeInvoiceRepository.findByStudentIdOrderByDueDateDesc(student.getId())
                .stream()
                .map(mapper::toFeeInvoiceResponse)
                .limit(5)
                .collect(Collectors.toList());

        return DashboardStatsResponse.builder()
                .studentProfile(studentProfile)
                .roomDetails(roomResponse)
                .roommates(roommates)
                .recentComplaints(complaints)
                .recentInvoices(invoices)
                .build();
    }
}
