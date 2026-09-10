package com.yourorg.appname.service.impl;

import com.yourorg.appname.dto.request.StudentRequest;
import com.yourorg.appname.dto.response.StudentResponse;
import com.yourorg.appname.entity.Room;
import com.yourorg.appname.entity.Student;
import com.yourorg.appname.exception.BadRequestException;
import com.yourorg.appname.exception.ResourceNotFoundException;
import com.yourorg.appname.mapper.EntityMapper;
import com.yourorg.appname.repository.RoomRepository;
import com.yourorg.appname.repository.StudentRepository;
import com.yourorg.appname.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;
    private final RoomRepository roomRepository;
    private final EntityMapper mapper;

    @Override
    public List<StudentResponse> getAllStudents(String query, String feeStatus, String wing) {
        String cleanQuery = (query != null && !query.trim().isEmpty()) ? query.trim() : null;
        String cleanFee = (feeStatus != null && !feeStatus.trim().isEmpty() && !feeStatus.equalsIgnoreCase("ALL")) ? feeStatus.trim() : null;
        String cleanWing = (wing != null && !wing.trim().isEmpty() && !wing.equalsIgnoreCase("ALL")) ? wing.trim() : null;

        List<Student> students = studentRepository.searchStudents(cleanQuery, cleanFee, cleanWing);
        return students.stream().map(mapper::toStudentResponse).collect(Collectors.toList());
    }

    @Override
    public StudentResponse getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", id));
        return mapper.toStudentResponse(student);
    }

    @Override
    public StudentResponse getStudentByRollNumber(String rollNumber) {
        Student student = studentRepository.findByRollNumber(rollNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "rollNumber", rollNumber));
        return mapper.toStudentResponse(student);
    }

    @Override
    @Transactional
    public StudentResponse createStudent(StudentRequest request) {
        if (studentRepository.findByRollNumber(request.getRollNumber()).isPresent()) {
            throw new BadRequestException("Student with roll number " + request.getRollNumber() + " already exists");
        }

        Room room = null;
        if (request.getRoomId() != null) {
            room = roomRepository.findById(request.getRoomId())
                    .orElseThrow(() -> new ResourceNotFoundException("Room", "id", request.getRoomId()));
            if (room.getOccupiedBeds() < room.getCapacity()) {
                room.setOccupiedBeds(room.getOccupiedBeds() + 1);
                if (room.getOccupiedBeds() >= room.getCapacity()) {
                    room.setStatus("FULL");
                } else {
                    room.setStatus("PARTIALLY_OCCUPIED");
                }
                roomRepository.save(room);
            }
        }

        Student student = Student.builder()
                .rollNumber(request.getRollNumber())
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .room(room)
                .bedNumber(request.getBedNumber())
                .department(request.getDepartment() != null ? request.getDepartment() : "General")
                .academicYear(request.getAcademicYear() != null ? request.getAcademicYear() : "1st Yr")
                .guardianName(request.getGuardianName())
                .guardianPhone(request.getGuardianPhone())
                .attendanceRate(request.getAttendanceRate() != null ? request.getAttendanceRate() : new BigDecimal("100.00"))
                .feeStatus(request.getFeeStatus() != null ? request.getFeeStatus() : "PENDING")
                .status(request.getStatus() != null ? request.getStatus() : "ACTIVE")
                .avatarUrl(request.getAvatarUrl())
                .build();

        Student saved = studentRepository.save(student);
        return mapper.toStudentResponse(saved);
    }

    @Override
    @Transactional
    public StudentResponse updateStudent(Long id, StudentRequest request) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", id));

        student.setFullName(request.getFullName());
        student.setEmail(request.getEmail());
        student.setPhone(request.getPhone());
        if (request.getDepartment() != null) student.setDepartment(request.getDepartment());
        if (request.getAcademicYear() != null) student.setAcademicYear(request.getAcademicYear());
        if (request.getGuardianName() != null) student.setGuardianName(request.getGuardianName());
        if (request.getGuardianPhone() != null) student.setGuardianPhone(request.getGuardianPhone());
        if (request.getFeeStatus() != null) student.setFeeStatus(request.getFeeStatus());
        if (request.getStatus() != null) student.setStatus(request.getStatus());
        if (request.getBedNumber() != null) student.setBedNumber(request.getBedNumber());
        if (request.getAvatarUrl() != null) student.setAvatarUrl(request.getAvatarUrl());

        if (request.getRoomId() != null && (student.getRoom() == null || !student.getRoom().getId().equals(request.getRoomId()))) {
            Room newRoom = roomRepository.findById(request.getRoomId())
                    .orElseThrow(() -> new ResourceNotFoundException("Room", "id", request.getRoomId()));
            student.setRoom(newRoom);
        }

        Student updated = studentRepository.save(student);
        return mapper.toStudentResponse(updated);
    }

    @Override
    @Transactional
    public void deleteStudent(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", id));
        if (student.getRoom() != null) {
            Room room = student.getRoom();
            if (room.getOccupiedBeds() > 0) {
                room.setOccupiedBeds(room.getOccupiedBeds() - 1);
                if (room.getOccupiedBeds() == 0) {
                    room.setStatus("AVAILABLE");
                } else {
                    room.setStatus("PARTIALLY_OCCUPIED");
                }
                roomRepository.save(room);
            }
        }
        studentRepository.delete(student);
    }
}
