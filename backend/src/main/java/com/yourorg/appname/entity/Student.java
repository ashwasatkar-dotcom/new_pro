package com.yourorg.appname.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "students")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "roll_number", nullable = false, unique = true, length = 100)
    private String rollNumber;

    @Column(name = "full_name", nullable = false, length = 150)
    private String fullName;

    @Column(nullable = false, length = 150)
    private String email;

    @Column(nullable = false, length = 50)
    private String phone;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id")
    private Room room;

    @Column(name = "bed_number", length = 20)
    private String bedNumber; // 'Bed A', 'Bed B', 'Bed C'

    @Column(nullable = false, length = 100)
    private String department;

    @Column(name = "academic_year", nullable = false, length = 50)
    private String academicYear;

    @Column(name = "guardian_name", length = 150)
    private String guardianName;

    @Column(name = "guardian_phone", length = 50)
    private String guardianPhone;

    @Column(name = "attendance_rate", nullable = false, precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal attendanceRate = new BigDecimal("100.00");

    @Column(name = "fee_status", nullable = false, length = 50)
    @Builder.Default
    private String feeStatus = "PAID"; // 'PAID', 'PENDING', 'OVERDUE'

    @Column(nullable = false, length = 50)
    @Builder.Default
    private String status = "ACTIVE"; // 'ACTIVE', 'ON_LEAVE', 'SUSPENDED'

    @Column(name = "avatar_url", length = 500)
    private String avatarUrl;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
