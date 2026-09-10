package com.yourorg.appname.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PaymentRequest {
    @NotBlank(message = "Payment mode is required")
    private String paymentMode; // 'UPI', 'Bank Transfer', 'Credit Card', 'Cash'

    private String transactionRef;
    private String notes;
}
