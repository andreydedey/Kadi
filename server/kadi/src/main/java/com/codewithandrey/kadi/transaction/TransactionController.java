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
@RequestMapping("wallet/{walletId}/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @GetMapping
    public ResponseEntity<List<TransactionDetailDTO>> listTransactions(@PathVariable UUID walletId) {
        return ResponseEntity.ok(transactionService.listByWallet(walletId));
    }

    @GetMapping("/summary")
    public ResponseEntity<List<WeeklyTransactionSummaryDTO>> listWeeklySummary(@PathVariable UUID walletId) {
        return ResponseEntity.ok(transactionService.listWeeklySummary(walletId));
    }

    @PostMapping
    public ResponseEntity<TransactionDTO> createTransaction(
            @PathVariable UUID walletId,
            @RequestBody TransactionDTO request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(transactionService.create(walletId, request));
    }

    @PutMapping("/{transactionId}")
    public ResponseEntity<TransactionDTO> updateTransaction(
            @PathVariable UUID walletId,
            @PathVariable UUID transactionId,
            @RequestBody TransactionDTO request
    ) {
        return ResponseEntity.ok(transactionService.update(walletId, transactionId, request));
    }

    @DeleteMapping("/{transactionId}")
    public ResponseEntity<Void> deleteTransaction(
            @PathVariable UUID walletId,
            @PathVariable UUID transactionId
    ) {
        transactionService.delete(walletId, transactionId);
        return ResponseEntity.noContent().build();
    }
}
