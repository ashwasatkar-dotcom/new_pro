package com.yourorg.appname.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "complaints")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Complaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ticket_number", nullable = false, unique = true, length = 50)
    private String ticketNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id")
    private Room room;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false, columnDefinition = "NVARCHAR(MAX)")
    private String description;

    @Column(nullable = false, length = 100)
    private String category; // 'Plumbing', 'Electrical', 'WiFi', 'Cleanliness', 'Carpentry', 'Discipline'

    @Column(nullable = false, length = 50)
    @Builder.Default
    private String priority = "MEDIUM"; // 'LOW', 'MEDIUM', 'HIGH', 'URGENT'

    @Column(nullable = false, length = 50)
    @Builder.Default
    private String status = "OPEN"; // 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'

    @Column(name = "assigned_staff", length = 150)
    private String assignedStaff;

    @Column(name = "resolution_notes", columnDefinition = "NVARCHAR(MAX)")
    private String resolutionNotes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
