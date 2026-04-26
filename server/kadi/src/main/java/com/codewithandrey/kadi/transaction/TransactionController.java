package com.codewithandrey.kadi.transaction;

import com.codewithandrey.kadi.transaction.dto.TransactionDTO;
import com.codewithandrey.kadi.transaction.dto.TransactionDetailDTO;
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

    @PostMapping
    public ResponseEntity<TransactionDTO> createTransaction(
            @PathVariable UUID walletId,
            @RequestBody TransactionDTO request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(transactionService.create(walletId, request));
    }
}
