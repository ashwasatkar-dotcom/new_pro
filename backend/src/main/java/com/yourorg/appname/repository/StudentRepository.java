package com.yourorg.appname.repository;

import com.yourorg.appname.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByRollNumber(String rollNumber);
    boolean existsByRollNumber(String rollNumber);
    Optional<Student> findByUserId(Long userId);
    List<Student> findByFeeStatus(String feeStatus);
    List<Student> findByRoomId(Long roomId);

    @Query("SELECT s FROM Student s LEFT JOIN s.room r WHERE " +
           "(:query IS NULL OR LOWER(s.fullName) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(s.rollNumber) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(s.department) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:feeStatus IS NULL OR s.feeStatus = :feeStatus) AND " +
           "(:wing IS NULL OR r.wing = :wing)")
    List<Student> searchStudents(@Param("query") String query,
                                 @Param("feeStatus") String feeStatus,
                                 @Param("wing") String wing);
}
