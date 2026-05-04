package com.codewithandrey.kadi.transaction;

import com.codewithandrey.kadi.transaction.dto.TransactionDTO;
import com.codewithandrey.kadi.transaction.dto.TransactionDetailDTO;
import com.codewithandrey.kadi.transaction.dto.WeeklyTransactionSummaryDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @GetMapping("transaction")
    public ResponseEntity<List<TransactionDetailDTO>> listRecent(
            @RequestParam(required = false) UUID walletId
    ) {
        return ResponseEntity.ok(transactionService.listRecent(walletId));
    }

    @GetMapping("wallet/{walletId}/transactions")
    public ResponseEntity<List<TransactionDetailDTO>> listTransactions(@PathVariable UUID walletId) {
        return ResponseEntity.ok(transactionService.listByWallet(walletId));
    }

    @GetMapping("wallet/{walletId}/transactions/summary")
    public ResponseEntity<List<WeeklyTransactionSummaryDTO>> listWeeklySummary(@PathVariable UUID walletId) {
        return ResponseEntity.ok(transactionService.listWeeklySummary(walletId));
    }

    @PostMapping("wallet/{walletId}/transactions")
    public ResponseEntity<TransactionDTO> createTransaction(
            @PathVariable UUID walletId,
            @RequestBody TransactionDTO request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(transactionService.create(walletId, request));
    }

    @PutMapping("wallet/{walletId}/transactions/{transactionId}")
    public ResponseEntity<TransactionDTO> updateTransaction(
            @PathVariable UUID walletId,
            @PathVariable UUID transactionId,
            @RequestBody TransactionDTO request
    ) {
        return ResponseEntity.ok(transactionService.update(walletId, transactionId, request));
    }

    @DeleteMapping("wallet/{walletId}/transactions/{transactionId}")
    public ResponseEntity<Void> deleteTransaction(
            @PathVariable UUID walletId,
            @PathVariable UUID transactionId
    ) {
        transactionService.delete(walletId, transactionId);
        return ResponseEntity.noContent().build();
    }
}
