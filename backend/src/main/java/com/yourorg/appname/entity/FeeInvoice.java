package com.yourorg.appname.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "fee_invoices")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeeInvoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "invoice_number", nullable = false, unique = true, length = 50)
    private String invoiceNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(name = "fee_type", nullable = false, length = 100)
    private String feeType; // 'Hostel Term Fee', 'Mess & Dining Fee', 'Security Deposit', 'Utility Charges'

    @Column(name = "term_name", nullable = false, length = 100)
    private String termName; // 'Fall 2024', 'Spring 2025'

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;

    @Column(name = "paid_date")
    private LocalDate paidDate;

    @Column(nullable = false, length = 50)
    @Builder.Default
    private String status = "PENDING"; // 'PAID', 'PENDING', 'OVERDUE', 'PARTIAL'

    @Column(name = "transaction_ref", length = 100)
    private String transactionRef;

    @Column(name = "payment_mode", length = 50)
    private String paymentMode; // 'UPI', 'Bank Transfer', 'Credit Card', 'Cash'

    @Column(length = 500)
    private String notes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
