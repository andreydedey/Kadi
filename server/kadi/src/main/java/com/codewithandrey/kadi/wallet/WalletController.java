package com.codewithandrey.kadi.wallet;

import com.codewithandrey.kadi.wallet.dto.WalletDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("wallet")
@RequiredArgsConstructor
public class WalletController {

    private final WalletService walletService;

    @GetMapping("/{uuid}")
    public ResponseEntity<WalletDTO> getWallet(@PathVariable UUID uuid) {
        return ResponseEntity.ok(walletService.getWallet(uuid));
    }
}
