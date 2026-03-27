package com.codewithandrey.kadi.wallet;

import com.codewithandrey.kadi.exception.ResourceNotFoundException;
import com.codewithandrey.kadi.wallet.dto.WalletDTO;
import com.codewithandrey.kadi.wallet.mapper.WalletMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class WalletService {

    private final WalletRepository walletRepository;
    private final WalletMapper walletMapper;

    @Transactional(readOnly = true)
    public Page<WalletDTO> listWallets(Pageable pageable) {
        Specification<Wallet> spec = Specification.where(null);
        Page<Wallet> page = walletRepository.findAll(spec, pageable);
        return page.map(walletMapper::toDTO);
    }

    @Transactional(readOnly = true)
    public WalletDTO getWallet(UUID uuid) {
        var wallet = walletRepository.findById(uuid)
                .orElseThrow(() -> new ResourceNotFoundException("wallet not found"));

        return walletMapper.toDTO(wallet);
    }
}
