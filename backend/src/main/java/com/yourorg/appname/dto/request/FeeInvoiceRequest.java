package com.yourorg.appname.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class FeeInvoiceRequest {
    @NotNull(message = "Student ID is required")
    private Long studentId;

    private String feeType;
    private String termName;

    @NotNull(message = "Amount is required")
    private BigDecimal amount;

    @NotNull(message = "Due date is required")
    private LocalDate dueDate;

    private String status; // 'PENDING', 'PAID', 'OVERDUE'
    private String notes;
}
