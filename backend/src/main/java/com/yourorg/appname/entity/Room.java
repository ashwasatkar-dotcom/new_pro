package com.yourorg.appname.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "rooms")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "room_number", nullable = false, length = 50)
    private String roomNumber;

    @Column(nullable = false, length = 50)
    private String wing; // 'Wing A', 'Wing B', 'Wing C'

    @Column(nullable = false)
    private Integer floor; // 1, 2, 3, 4

    @Column(name = "room_type", nullable = false, length = 50)
    private String roomType; // 'Single AC', 'Double AC', 'Triple AC'

    @Column(nullable = false)
    @Builder.Default
    private Integer capacity = 3;

    @Column(name = "occupied_beds", nullable = false)
    @Builder.Default
    private Integer occupiedBeds = 0;

    @Column(name = "monthly_rent", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal monthlyRent = new BigDecimal("1200.00");

    @Column(nullable = false, length = 50)
    @Builder.Default
    private String status = "AVAILABLE"; // 'AVAILABLE', 'PARTIALLY_OCCUPIED', 'FULL', 'MAINTENANCE'

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
