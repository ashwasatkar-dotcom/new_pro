package com.yourorg.appname.repository;

import com.yourorg.appname.entity.AttendanceRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRecordRepository extends JpaRepository<AttendanceRecord, Long> {
    List<AttendanceRecord> findByRecordDate(LocalDate recordDate);
    Optional<AttendanceRecord> findByStudentIdAndRecordDate(Long studentId, LocalDate recordDate);
    List<AttendanceRecord> findByStudentIdOrderByRecordDateDesc(Long studentId);
    long countByRecordDateAndStatus(LocalDate recordDate, String status);
}
