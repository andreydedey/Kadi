package com.codewithandrey.kadi.wallet;

import com.codewithandrey.kadi.auth.AuthService;
import com.codewithandrey.kadi.exception.ResourceNotFoundException;
import com.codewithandrey.kadi.wallet.dto.CreateWalletRequest;
import com.codewithandrey.kadi.wallet.dto.WalletDTO;
import com.codewithandrey.kadi.wallet.mapper.WalletMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class WalletService {

    private final WalletRepository walletRepository;
    private final WalletMapper walletMapper;
    private final AuthService authService;

    @Transactional(readOnly = true)
    public Page<WalletDTO> listWallets(Pageable pageable) {
        return walletRepository.findAllByUser(authService.currentUser(), pageable)
                .map(walletMapper::toDTO);
    }

    @Transactional(readOnly = true)
    public WalletDTO getWallet(UUID id) {
        return walletMapper.toDTO(findOwnedWallet(id));
    }

    public WalletDTO createWallet(CreateWalletRequest createWalletRequest) {
        Wallet wallet = walletMapper.toEntity(createWalletRequest);
        wallet.setUser(authService.currentUser());
        walletRepository.save(wallet);
        return walletMapper.toDTO(wallet);
    }

    private Wallet findOwnedWallet(UUID id) {
        return walletRepository.findByIdAndUser(id, authService.currentUser())
                .orElseThrow(() -> new ResourceNotFoundException("wallet not found"));
    }
}
