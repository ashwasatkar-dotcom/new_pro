package com.yourorg.appname.repository;

import com.yourorg.appname.entity.FeeInvoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface FeeInvoiceRepository extends JpaRepository<FeeInvoice, Long> {
    Optional<FeeInvoice> findByInvoiceNumber(String invoiceNumber);
    List<FeeInvoice> findByStatus(String status);
    List<FeeInvoice> findByStudentIdOrderByDueDateDesc(Long studentId);
    List<FeeInvoice> findAllByOrderByCreatedAtDesc();

    @Query("SELECT COALESCE(SUM(f.amount), 0) FROM FeeInvoice f WHERE f.status = 'PAID'")
    BigDecimal sumTotalPaidFees();

    @Query("SELECT COALESCE(SUM(f.amount), 0) FROM FeeInvoice f WHERE f.status IN ('PENDING', 'OVERDUE')")
    BigDecimal sumTotalPendingFees();

    long countByStatus(String status);
}
