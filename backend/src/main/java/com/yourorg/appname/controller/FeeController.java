package com.yourorg.appname.controller;

import com.yourorg.appname.dto.request.FeeInvoiceRequest;
import com.yourorg.appname.dto.request.PaymentRequest;
import com.yourorg.appname.dto.response.ApiResponse;
import com.yourorg.appname.dto.response.FeeInvoiceResponse;
import com.yourorg.appname.service.FeeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fees")
@RequiredArgsConstructor
public class FeeController {

    private final FeeService feeService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<FeeInvoiceResponse>>> getAllInvoices(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String query) {
        List<FeeInvoiceResponse> invoices = feeService.getAllInvoices(status, query);
        return ResponseEntity.ok(ApiResponse.success(invoices));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FeeInvoiceResponse>> getInvoiceById(@PathVariable Long id) {
        FeeInvoiceResponse invoice = feeService.getInvoiceById(id);
        return ResponseEntity.ok(ApiResponse.success(invoice));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<ApiResponse<List<FeeInvoiceResponse>>> getStudentInvoices(@PathVariable Long studentId) {
        List<FeeInvoiceResponse> invoices = feeService.getInvoicesByStudentId(studentId);
        return ResponseEntity.ok(ApiResponse.success(invoices));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<FeeInvoiceResponse>> createInvoice(@Valid @RequestBody FeeInvoiceRequest request) {
        FeeInvoiceResponse created = feeService.createInvoice(request);
        return ResponseEntity.ok(ApiResponse.success("Fee invoice generated successfully", created));
    }

    @PostMapping("/{id}/pay")
    public ResponseEntity<ApiResponse<FeeInvoiceResponse>> recordPayment(
            @PathVariable Long id,
            @Valid @RequestBody PaymentRequest request) {
        FeeInvoiceResponse response = feeService.recordPayment(id, request);
        return ResponseEntity.ok(ApiResponse.success("Payment recorded successfully", response));
    }

    @PostMapping("/{id}/remind")
    public ResponseEntity<ApiResponse<FeeInvoiceResponse>> sendReminder(@PathVariable Long id) {
        FeeInvoiceResponse response = feeService.sendReminder(id);
        return ResponseEntity.ok(ApiResponse.success("Reminder notice sent successfully", response));
    }
}
