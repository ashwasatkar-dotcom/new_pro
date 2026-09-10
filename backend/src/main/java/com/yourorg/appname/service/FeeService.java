package com.yourorg.appname.service;

import com.yourorg.appname.dto.request.FeeInvoiceRequest;
import com.yourorg.appname.dto.request.PaymentRequest;
import com.yourorg.appname.dto.response.FeeInvoiceResponse;
import java.util.List;

public interface FeeService {
    List<FeeInvoiceResponse> getAllInvoices(String status, String query);
    FeeInvoiceResponse getInvoiceById(Long id);
    List<FeeInvoiceResponse> getInvoicesByStudentId(Long studentId);
    FeeInvoiceResponse createInvoice(FeeInvoiceRequest request);
    FeeInvoiceResponse recordPayment(Long id, PaymentRequest request);
    FeeInvoiceResponse sendReminder(Long id);
}
