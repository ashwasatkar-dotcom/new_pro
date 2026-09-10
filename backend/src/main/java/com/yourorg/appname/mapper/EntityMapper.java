package com.yourorg.appname.mapper;

import com.yourorg.appname.dto.response.*;
import com.yourorg.appname.entity.*;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class EntityMapper {

    public UserResponse toUserResponse(User user) {
        if (user == null) return null;
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .avatarUrl(user.getAvatarUrl())
                .department(user.getDepartment())
                .blockAssigned(user.getBlockAssigned())
                .isActive(user.getIsActive())
                .build();
    }

    public StudentResponse toStudentResponse(Student student) {
        if (student == null) return null;
        return StudentResponse.builder()
                .id(student.getId())
                .userId(student.getUser() != null ? student.getUser().getId() : null)
                .rollNumber(student.getRollNumber())
                .fullName(student.getFullName())
                .email(student.getEmail())
                .phone(student.getPhone())
                .roomId(student.getRoom() != null ? student.getRoom().getId() : null)
                .roomNumber(student.getRoom() != null ? student.getRoom().getRoomNumber() : null)
                .wing(student.getRoom() != null ? student.getRoom().getWing() : null)
                .floor(student.getRoom() != null ? student.getRoom().getFloor() : null)
                .bedNumber(student.getBedNumber())
                .department(student.getDepartment())
                .academicYear(student.getAcademicYear())
                .guardianName(student.getGuardianName())
                .guardianPhone(student.getGuardianPhone())
                .attendanceRate(student.getAttendanceRate())
                .feeStatus(student.getFeeStatus())
                .status(student.getStatus())
                .avatarUrl(student.getAvatarUrl())
                .createdAt(student.getCreatedAt())
                .build();
    }

    public RoomResponse toRoomResponse(Room room, List<Student> occupants) {
        if (room == null) return null;
        List<StudentResponse> occupantDtos = occupants != null
                ? occupants.stream().map(this::toStudentResponse).collect(Collectors.toList())
                : Collections.emptyList();

        return RoomResponse.builder()
                .id(room.getId())
                .roomNumber(room.getRoomNumber())
                .wing(room.getWing())
                .floor(room.getFloor())
                .roomType(room.getRoomType())
                .capacity(room.getCapacity())
                .occupiedBeds(room.getOccupiedBeds())
                .monthlyRent(room.getMonthlyRent())
                .status(room.getStatus())
                .occupants(occupantDtos)
                .build();
    }

    public AttendanceResponse toAttendanceResponse(AttendanceRecord record) {
        if (record == null) return null;
        Student s = record.getStudent();
        Room r = s != null ? s.getRoom() : null;

        return AttendanceResponse.builder()
                .id(record.getId())
                .studentId(s != null ? s.getId() : null)
                .studentName(s != null ? s.getFullName() : null)
                .rollNumber(s != null ? s.getRollNumber() : null)
                .roomNumber(r != null ? r.getRoomNumber() : null)
                .wing(r != null ? r.getWing() : null)
                .floor(r != null ? r.getFloor() : null)
                .bedNumber(s != null ? s.getBedNumber() : null)
                .avatarUrl(s != null ? s.getAvatarUrl() : null)
                .recordDate(record.getRecordDate())
                .status(record.getStatus())
                .checkInTime(record.getCheckInTime())
                .remarks(record.getRemarks())
                .markedByName(record.getMarkedByUser() != null ? record.getMarkedByUser().getFullName() : null)
                .build();
    }

    public ComplaintResponse toComplaintResponse(Complaint complaint) {
        if (complaint == null) return null;
        Student s = complaint.getStudent();
        Room r = complaint.getRoom() != null ? complaint.getRoom() : (s != null ? s.getRoom() : null);

        return ComplaintResponse.builder()
                .id(complaint.getId())
                .ticketNumber(complaint.getTicketNumber())
                .studentId(s != null ? s.getId() : null)
                .studentName(s != null ? s.getFullName() : null)
                .studentRollNumber(s != null ? s.getRollNumber() : null)
                .studentAvatarUrl(s != null ? s.getAvatarUrl() : null)
                .roomId(r != null ? r.getId() : null)
                .roomNumber(r != null ? r.getRoomNumber() : null)
                .wing(r != null ? r.getWing() : null)
                .title(complaint.getTitle())
                .description(complaint.getDescription())
                .category(complaint.getCategory())
                .priority(complaint.getPriority())
                .status(complaint.getStatus())
                .assignedStaff(complaint.getAssignedStaff())
                .resolutionNotes(complaint.getResolutionNotes())
                .createdAt(complaint.getCreatedAt())
                .resolvedAt(complaint.getResolvedAt())
                .build();
    }

    public FeeInvoiceResponse toFeeInvoiceResponse(FeeInvoice invoice) {
        if (invoice == null) return null;
        Student s = invoice.getStudent();
        Room r = s != null ? s.getRoom() : null;

        return FeeInvoiceResponse.builder()
                .id(invoice.getId())
                .invoiceNumber(invoice.getInvoiceNumber())
                .studentId(s != null ? s.getId() : null)
                .studentName(s != null ? s.getFullName() : null)
                .studentRollNumber(s != null ? s.getRollNumber() : null)
                .studentAvatarUrl(s != null ? s.getAvatarUrl() : null)
                .roomNumber(r != null ? r.getRoomNumber() : null)
                .wing(r != null ? r.getWing() : null)
                .feeType(invoice.getFeeType())
                .termName(invoice.getTermName())
                .amount(invoice.getAmount())
                .dueDate(invoice.getDueDate())
                .paidDate(invoice.getPaidDate())
                .status(invoice.getStatus())
                .transactionRef(invoice.getTransactionRef())
                .paymentMode(invoice.getPaymentMode())
                .notes(invoice.getNotes())
                .createdAt(invoice.getCreatedAt())
                .build();
    }
}
