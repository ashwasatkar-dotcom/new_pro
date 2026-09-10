package com.yourorg.appname.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeeInvoiceResponse {
    private Long id;
    private String invoiceNumber;
    private Long studentId;
    private String studentName;
    private String studentRollNumber;
    private String studentAvatarUrl;
    private String roomNumber;
    private String wing;
    private String feeType;
    private String termName;
    private BigDecimal amount;
    private LocalDate dueDate;
    private LocalDate paidDate;
    private String status; // 'PAID', 'PENDING', 'OVERDUE', 'PARTIAL'
    private String transactionRef;
    private String paymentMode;
    private String notes;
    private LocalDateTime createdAt;
}
