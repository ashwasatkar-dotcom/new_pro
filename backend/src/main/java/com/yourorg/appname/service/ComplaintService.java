package com.yourorg.appname.service;

import com.yourorg.appname.dto.request.ComplaintRequest;
import com.yourorg.appname.dto.response.ComplaintResponse;
import java.util.List;

public interface ComplaintService {
    List<ComplaintResponse> getAllComplaints(String status, String category, String priority);
    ComplaintResponse getComplaintById(Long id);
    ComplaintResponse getComplaintByTicket(String ticketNumber);
    List<ComplaintResponse> getComplaintsByStudentId(Long studentId);
    ComplaintResponse createComplaint(ComplaintRequest request, String username);
    ComplaintResponse updateComplaintStatus(Long id, String status, String resolutionNotes, String assignedStaff);
    void deleteComplaint(Long id);
}
