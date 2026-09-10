package com.yourorg.appname.controller;

import com.yourorg.appname.dto.request.ComplaintRequest;
import com.yourorg.appname.dto.response.ApiResponse;
import com.yourorg.appname.dto.response.ComplaintResponse;
import com.yourorg.appname.service.ComplaintService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/complaints")
@RequiredArgsConstructor
public class ComplaintController {

    private final ComplaintService complaintService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ComplaintResponse>>> getAllComplaints(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String priority) {
        List<ComplaintResponse> complaints = complaintService.getAllComplaints(status, category, priority);
        return ResponseEntity.ok(ApiResponse.success(complaints));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ComplaintResponse>> getComplaintById(@PathVariable Long id) {
        ComplaintResponse complaint = complaintService.getComplaintById(id);
        return ResponseEntity.ok(ApiResponse.success(complaint));
    }

    @GetMapping("/ticket/{ticketNumber}")
    public ResponseEntity<ApiResponse<ComplaintResponse>> getComplaintByTicket(@PathVariable String ticketNumber) {
        ComplaintResponse complaint = complaintService.getComplaintByTicket(ticketNumber);
        return ResponseEntity.ok(ApiResponse.success(complaint));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<ApiResponse<List<ComplaintResponse>>> getComplaintsByStudentId(@PathVariable Long studentId) {
        List<ComplaintResponse> complaints = complaintService.getComplaintsByStudentId(studentId);
        return ResponseEntity.ok(ApiResponse.success(complaints));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ComplaintResponse>> createComplaint(
            @Valid @RequestBody ComplaintRequest request,
            Authentication authentication) {
        String username = authentication != null ? authentication.getName() : null;
        ComplaintResponse created = complaintService.createComplaint(request, username);
        return ResponseEntity.ok(ApiResponse.success("Complaint registered successfully", created));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<ComplaintResponse>> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String status = body.get("status");
        String resolutionNotes = body.get("resolutionNotes");
        String assignedStaff = body.get("assignedStaff");

        ComplaintResponse updated = complaintService.updateComplaintStatus(id, status, resolutionNotes, assignedStaff);
        return ResponseEntity.ok(ApiResponse.success("Complaint status updated", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteComplaint(@PathVariable Long id) {
        complaintService.deleteComplaint(id);
        return ResponseEntity.ok(ApiResponse.success("Complaint removed successfully", null));
    }
}
