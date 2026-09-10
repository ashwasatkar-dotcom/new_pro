package com.yourorg.appname.service.impl;

import com.yourorg.appname.dto.request.ComplaintRequest;
import com.yourorg.appname.dto.response.ComplaintResponse;
import com.yourorg.appname.entity.Complaint;
import com.yourorg.appname.entity.Room;
import com.yourorg.appname.entity.Student;
import com.yourorg.appname.entity.User;
import com.yourorg.appname.exception.ResourceNotFoundException;
import com.yourorg.appname.mapper.EntityMapper;
import com.yourorg.appname.repository.ComplaintRepository;
import com.yourorg.appname.repository.RoomRepository;
import com.yourorg.appname.repository.StudentRepository;
import com.yourorg.appname.repository.UserRepository;
import com.yourorg.appname.service.ComplaintService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ComplaintServiceImpl implements ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final StudentRepository studentRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final EntityMapper mapper;

    @Override
    public List<ComplaintResponse> getAllComplaints(String status, String category, String priority) {
        List<Complaint> complaints = complaintRepository.findAllByOrderByCreatedAtDesc();

        if (status != null && !status.trim().isEmpty() && !status.equalsIgnoreCase("ALL")) {
            complaints = complaints.stream()
                    .filter(c -> c.getStatus().equalsIgnoreCase(status.trim()))
                    .collect(Collectors.toList());
        }
        if (category != null && !category.trim().isEmpty() && !category.equalsIgnoreCase("ALL")) {
            complaints = complaints.stream()
                    .filter(c -> c.getCategory().equalsIgnoreCase(category.trim()))
                    .collect(Collectors.toList());
        }
        if (priority != null && !priority.trim().isEmpty() && !priority.equalsIgnoreCase("ALL")) {
            complaints = complaints.stream()
                    .filter(c -> c.getPriority().equalsIgnoreCase(priority.trim()))
                    .collect(Collectors.toList());
        }

        return complaints.stream().map(mapper::toComplaintResponse).collect(Collectors.toList());
    }

    @Override
    public ComplaintResponse getComplaintById(Long id) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint", "id", id));
        return mapper.toComplaintResponse(complaint);
    }

    @Override
    public ComplaintResponse getComplaintByTicket(String ticketNumber) {
        Complaint complaint = complaintRepository.findByTicketNumber(ticketNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint", "ticketNumber", ticketNumber));
        return mapper.toComplaintResponse(complaint);
    }

    @Override
    public List<ComplaintResponse> getComplaintsByStudentId(Long studentId) {
        return complaintRepository.findByStudentIdOrderByCreatedAtDesc(studentId)
                .stream()
                .map(mapper::toComplaintResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ComplaintResponse createComplaint(ComplaintRequest request, String username) {
        Student student = null;
        if (request.getStudentId() != null) {
            student = studentRepository.findById(request.getStudentId()).orElse(null);
        }

        if (student == null && username != null) {
            User user = userRepository.findByUsername(username).orElse(null);
            if (user != null) {
                student = studentRepository.findByUserId(user.getId()).orElse(null);
            }
        }

        if (student == null) {
            student = studentRepository.findAll().stream().findFirst()
                    .orElseThrow(() -> new ResourceNotFoundException("No student found to register complaint"));
        }

        Room room = student.getRoom();
        if (request.getRoomId() != null) {
            room = roomRepository.findById(request.getRoomId()).orElse(room);
        }

        String ticketNumber = "CMP-" + (1000 + new Random().nextInt(9000));

        Complaint complaint = Complaint.builder()
                .ticketNumber(ticketNumber)
                .student(student)
                .room(room)
                .title(request.getTitle())
                .description(request.getDescription())
                .category(request.getCategory())
                .priority(request.getPriority() != null ? request.getPriority() : "MEDIUM")
                .status("OPEN")
                .assignedStaff(request.getAssignedStaff())
                .build();

        Complaint saved = complaintRepository.save(complaint);
        return mapper.toComplaintResponse(saved);
    }

    @Override
    @Transactional
    public ComplaintResponse updateComplaintStatus(Long id, String status, String resolutionNotes, String assignedStaff) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint", "id", id));

        if (status != null && !status.trim().isEmpty()) {
            complaint.setStatus(status.trim().toUpperCase());
            if ("RESOLVED".equalsIgnoreCase(status)) {
                complaint.setResolvedAt(LocalDateTime.now());
            }
        }
        if (resolutionNotes != null) {
            complaint.setResolutionNotes(resolutionNotes);
        }
        if (assignedStaff != null) {
            complaint.setAssignedStaff(assignedStaff);
        }

        Complaint updated = complaintRepository.save(complaint);
        return mapper.toComplaintResponse(updated);
    }

    @Override
    @Transactional
    public void deleteComplaint(Long id) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint", "id", id));
        complaintRepository.delete(complaint);
    }
}
