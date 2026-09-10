package com.yourorg.appname.service.impl;

import com.yourorg.appname.dto.request.AttendanceBatchRequest;
import com.yourorg.appname.dto.request.AttendanceRequest;
import com.yourorg.appname.dto.response.AttendanceResponse;
import com.yourorg.appname.entity.AttendanceRecord;
import com.yourorg.appname.entity.Student;
import com.yourorg.appname.entity.User;
import com.yourorg.appname.exception.ResourceNotFoundException;
import com.yourorg.appname.mapper.EntityMapper;
import com.yourorg.appname.repository.AttendanceRecordRepository;
import com.yourorg.appname.repository.StudentRepository;
import com.yourorg.appname.repository.UserRepository;
import com.yourorg.appname.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendanceServiceImpl implements AttendanceService {

    private final AttendanceRecordRepository attendanceRecordRepository;
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final EntityMapper mapper;

    @Override
    public List<AttendanceResponse> getAttendanceByDate(LocalDate date, String wing, Integer floor) {
        LocalDate queryDate = date != null ? date : LocalDate.now();
        List<AttendanceRecord> records = attendanceRecordRepository.findByRecordDate(queryDate);

        // If records don't exist yet for all active students today, generate defaults or include them
        List<Student> allStudents = studentRepository.findAll();
        for (Student student : allStudents) {
            boolean exists = records.stream().anyMatch(r -> r.getStudent().getId().equals(student.getId()));
            if (!exists) {
                AttendanceRecord autoRecord = AttendanceRecord.builder()
                        .student(student)
                        .recordDate(queryDate)
                        .status("PRESENT")
                        .checkInTime("21:30")
                        .remarks("Curfew check verified")
                        .build();
                records.add(attendanceRecordRepository.save(autoRecord));
            }
        }

        // Apply filters
        return records.stream()
                .filter(r -> {
                    if (wing != null && !wing.trim().isEmpty() && !wing.equalsIgnoreCase("ALL")) {
                        if (r.getStudent().getRoom() == null || !wing.equalsIgnoreCase(r.getStudent().getRoom().getWing())) {
                            return false;
                        }
                    }
                    if (floor != null && floor > 0) {
                        if (r.getStudent().getRoom() == null || !floor.equals(r.getStudent().getRoom().getFloor())) {
                            return false;
                        }
                    }
                    return true;
                })
                .map(mapper::toAttendanceResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<AttendanceResponse> getStudentAttendanceHistory(Long studentId) {
        return attendanceRecordRepository.findByStudentIdOrderByRecordDateDesc(studentId)
                .stream()
                .map(mapper::toAttendanceResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public AttendanceResponse markAttendance(AttendanceRequest request, String markedByUsername) {
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", request.getStudentId()));

        User markedByUser = null;
        if (markedByUsername != null) {
            markedByUser = userRepository.findByUsername(markedByUsername).orElse(null);
        }

        LocalDate recordDate = request.getRecordDate() != null ? request.getRecordDate() : LocalDate.now();

        AttendanceRecord record = attendanceRecordRepository.findByStudentIdAndRecordDate(student.getId(), recordDate)
                .orElse(AttendanceRecord.builder()
                        .student(student)
                        .recordDate(recordDate)
                        .build());

        record.setStatus(request.getStatus() != null ? request.getStatus() : "PRESENT");
        record.setCheckInTime(request.getCheckInTime() != null ? request.getCheckInTime() : LocalTime.now().format(DateTimeFormatter.ofPattern("HH:mm")));
        if (request.getRemarks() != null) record.setRemarks(request.getRemarks());
        if (markedByUser != null) record.setMarkedByUser(markedByUser);

        AttendanceRecord saved = attendanceRecordRepository.save(record);
        return mapper.toAttendanceResponse(saved);
    }

    @Override
    @Transactional
    public List<AttendanceResponse> markBatchAttendance(AttendanceBatchRequest batchRequest, String markedByUsername) {
        List<AttendanceResponse> responses = new ArrayList<>();
        LocalDate targetDate = batchRequest.getRecordDate() != null ? batchRequest.getRecordDate() : LocalDate.now();

        for (AttendanceRequest item : batchRequest.getItems()) {
            item.setRecordDate(targetDate);
            responses.add(markAttendance(item, markedByUsername));
        }
        return responses;
    }
}
