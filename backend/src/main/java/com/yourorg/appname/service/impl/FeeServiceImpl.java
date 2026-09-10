package com.yourorg.appname.service.impl;

import com.yourorg.appname.dto.request.FeeInvoiceRequest;
import com.yourorg.appname.dto.request.PaymentRequest;
import com.yourorg.appname.dto.response.FeeInvoiceResponse;
import com.yourorg.appname.entity.FeeInvoice;
import com.yourorg.appname.entity.Student;
import com.yourorg.appname.exception.ResourceNotFoundException;
import com.yourorg.appname.mapper.EntityMapper;
import com.yourorg.appname.repository.FeeInvoiceRepository;
import com.yourorg.appname.repository.StudentRepository;
import com.yourorg.appname.service.FeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FeeServiceImpl implements FeeService {

    private final FeeInvoiceRepository feeInvoiceRepository;
    private final StudentRepository studentRepository;
    private final EntityMapper mapper;

    @Override
    public List<FeeInvoiceResponse> getAllInvoices(String status, String query) {
        List<FeeInvoice> invoices = feeInvoiceRepository.findAllByOrderByCreatedAtDesc();

        if (status != null && !status.trim().isEmpty() && !status.equalsIgnoreCase("ALL")) {
            invoices = invoices.stream()
                    .filter(inv -> inv.getStatus().equalsIgnoreCase(status.trim()))
                    .collect(Collectors.toList());
        }

        if (query != null && !query.trim().isEmpty()) {
            String q = query.trim().toLowerCase();
            invoices = invoices.stream()
                    .filter(inv -> (inv.getInvoiceNumber() != null && inv.getInvoiceNumber().toLowerCase().contains(q))
                            || (inv.getStudent() != null && (
                                    inv.getStudent().getFullName().toLowerCase().contains(q)
                                    || inv.getStudent().getRollNumber().toLowerCase().contains(q)
                            ))
                            || (inv.getTransactionRef() != null && inv.getTransactionRef().toLowerCase().contains(q)))
                    .collect(Collectors.toList());
        }

        return invoices.stream().map(mapper::toFeeInvoiceResponse).collect(Collectors.toList());
    }

    @Override
    public FeeInvoiceResponse getInvoiceById(Long id) {
        FeeInvoice invoice = feeInvoiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("FeeInvoice", "id", id));
        return mapper.toFeeInvoiceResponse(invoice);
    }

    @Override
    public List<FeeInvoiceResponse> getInvoicesByStudentId(Long studentId) {
        return feeInvoiceRepository.findByStudentIdOrderByDueDateDesc(studentId)
                .stream()
                .map(mapper::toFeeInvoiceResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public FeeInvoiceResponse createInvoice(FeeInvoiceRequest request) {
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", request.getStudentId()));

        String invoiceNumber = "INV-2024-" + (100 + new Random().nextInt(900));

        FeeInvoice invoice = FeeInvoice.builder()
                .invoiceNumber(invoiceNumber)
                .student(student)
                .feeType(request.getFeeType() != null ? request.getFeeType() : "Hostel Term Fee")
                .termName(request.getTermName() != null ? request.getTermName() : "Fall 2024")
                .amount(request.getAmount())
                .dueDate(request.getDueDate())
                .status(request.getStatus() != null ? request.getStatus() : "PENDING")
                .notes(request.getNotes())
                .build();

        FeeInvoice saved = feeInvoiceRepository.save(invoice);
        return mapper.toFeeInvoiceResponse(saved);
    }

    @Override
    @Transactional
    public FeeInvoiceResponse recordPayment(Long id, PaymentRequest request) {
        FeeInvoice invoice = feeInvoiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("FeeInvoice", "id", id));

        invoice.setStatus("PAID");
        invoice.setPaidDate(LocalDate.now());
        invoice.setPaymentMode(request.getPaymentMode());
        invoice.setTransactionRef(request.getTransactionRef() != null ? request.getTransactionRef() : "TXN-" + (1000000 + new Random().nextInt(9000000)));
        if (request.getNotes() != null) {
            invoice.setNotes(request.getNotes());
        }

        FeeInvoice updated = feeInvoiceRepository.save(invoice);

        // Update student fee status if no pending invoices remain
        Student student = invoice.getStudent();
        boolean hasPending = feeInvoiceRepository.findByStudentIdOrderByDueDateDesc(student.getId()).stream()
                .anyMatch(i -> "PENDING".equalsIgnoreCase(i.getStatus()) || "OVERDUE".equalsIgnoreCase(i.getStatus()));
        if (!hasPending) {
            student.setFeeStatus("PAID");
            studentRepository.save(student);
        }

        return mapper.toFeeInvoiceResponse(updated);
    }

    @Override
    public FeeInvoiceResponse sendReminder(Long id) {
        FeeInvoice invoice = feeInvoiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("FeeInvoice", "id", id));
        // Simulate sending SMS/Email notification to student and guardian
        invoice.setNotes("Reminder notice dispatched to student & guardian on " + LocalDate.now());
        FeeInvoice updated = feeInvoiceRepository.save(invoice);
        return mapper.toFeeInvoiceResponse(updated);
    }
}
