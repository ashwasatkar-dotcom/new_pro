package com.yourorg.appname.service;

import com.yourorg.appname.dto.request.StudentRequest;
import com.yourorg.appname.dto.response.StudentResponse;
import java.util.List;

public interface StudentService {
    List<StudentResponse> getAllStudents(String query, String feeStatus, String wing);
    StudentResponse getStudentById(Long id);
    StudentResponse getStudentByRollNumber(String rollNumber);
    StudentResponse createStudent(StudentRequest request);
    StudentResponse updateStudent(Long id, StudentRequest request);
    void deleteStudent(Long id);
}
