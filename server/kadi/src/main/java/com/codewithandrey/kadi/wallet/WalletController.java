package com.codewithandrey.kadi.wallet;

import com.codewithandrey.kadi.category.dto.WalletCategoryDTO;
import com.codewithandrey.kadi.wallet.dto.CreateWalletRequest;
import com.codewithandrey.kadi.wallet.dto.WalletDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("wallet")
@RequiredArgsConstructor
public class WalletController {

    private final WalletService walletService;

    @GetMapping("currencies")
    public ResponseEntity<List<Currency>> getCurrencies() {
        return ResponseEntity.ok(List.of(Currency.values()));
    }

    @GetMapping("list")
    public ResponseEntity<Page<WalletDTO>> listWallets(Pageable pageable) {
        return ResponseEntity.ok(walletService.listWallets(pageable));
    }

    @GetMapping("/{uuid}")
    public ResponseEntity<WalletDTO> getWallet(@PathVariable UUID uuid) {
        return ResponseEntity.ok(walletService.getWallet(uuid));
    }

    @GetMapping("/{uuid}/categories")
    public ResponseEntity<List<WalletCategoryDTO>> listWalletCategories(@PathVariable UUID uuid) {
        return ResponseEntity.ok(walletService.listWalletCategories(uuid));
    }

    @PostMapping
    public ResponseEntity<WalletDTO> createWallet(@RequestBody CreateWalletRequest createWalletRequest) {
        WalletDTO createdWallet = walletService.createWallet(createWalletRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdWallet);
    }
}
