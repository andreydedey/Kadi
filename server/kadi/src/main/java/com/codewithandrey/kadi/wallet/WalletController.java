package com.codewithandrey.kadi.wallet;

import com.codewithandrey.kadi.wallet.dto.WalletDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("wallet")
@RequiredArgsConstructor
public class WalletController {

    private final WalletService walletService;

    @GetMapping("list")
    public ResponseEntity<Page<WalletDTO>> listWallets(
            Pageable pageable
    ) {
        return ResponseEntity.ok(walletService.listWallets(pageable));
    }

    @GetMapping("/{uuid}")
    public ResponseEntity<WalletDTO> getWallet(@PathVariable UUID uuid) {
        return ResponseEntity.ok(walletService.getWallet(uuid));
    }
}
