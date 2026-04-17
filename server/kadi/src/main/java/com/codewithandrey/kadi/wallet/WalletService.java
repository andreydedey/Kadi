package com.codewithandrey.kadi.wallet;

import com.codewithandrey.kadi.auth.AuthService;
import com.codewithandrey.kadi.auth.User;
import com.codewithandrey.kadi.category.Category;
import com.codewithandrey.kadi.category.CategoryRepository;
import com.codewithandrey.kadi.category.WalletCategory;
import com.codewithandrey.kadi.category.WalletCategoryId;
import com.codewithandrey.kadi.category.WalletCategoryRepository;
import com.codewithandrey.kadi.category.dto.CreateWalletCategoryRequest;
import com.codewithandrey.kadi.category.dto.UpdateWalletCategoryRequest;
import com.codewithandrey.kadi.category.dto.WalletCategoryDTO;
import com.codewithandrey.kadi.category.mapper.WalletCategoryMapper;
import com.codewithandrey.kadi.exception.ConflictException;
import com.codewithandrey.kadi.exception.ResourceNotFoundException;
import com.codewithandrey.kadi.wallet.dto.CreateWalletRequest;
import com.codewithandrey.kadi.wallet.dto.WalletDTO;
import com.codewithandrey.kadi.wallet.mapper.WalletMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class WalletService {

    private final WalletRepository walletRepository;
    private final WalletCategoryRepository walletCategoryRepository;
    private final CategoryRepository categoryRepository;
    private final WalletMapper walletMapper;
    private final WalletCategoryMapper walletCategoryMapper;
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
        User user = authService.currentUser();
        if (walletRepository.existsByNameAndUser(createWalletRequest.name(), user)) {
            throw new ConflictException("A wallet with this name already exists");
        }
        Wallet wallet = walletMapper.toEntity(createWalletRequest);
        wallet.setUser(user);
        wallet = walletRepository.save(wallet);
        return walletMapper.toDTO(wallet);
    }

    @Transactional(readOnly = true)
    public List<WalletCategoryDTO> listWalletCategories(UUID walletId) {
        Wallet wallet = findOwnedWallet(walletId);
        return walletCategoryRepository.findByWallet(wallet).stream()
                .map(wc -> new WalletCategoryDTO(
                        wc.getCategory().getId(),
                        wc.getCategory().getName(),
                        wc.getSpendingLimit(),
                        0L))
                .toList();
    }

    @Transactional
    public WalletCategoryDTO createWalletCategoryLimit(UUID walletId, CreateWalletCategoryRequest request) {
        Wallet wallet = findOwnedWallet(walletId);
        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        WalletCategory walletCategory = walletCategoryMapper.toEntity(request);

        walletCategory.setId(new WalletCategoryId(walletId, request.categoryId()));
        walletCategory.setWallet(wallet);
        walletCategory.setCategory(category);
        walletCategory.setSpent(0L);

        return walletCategoryMapper.toDTO(walletCategoryRepository.save(walletCategory));
    }

    @Transactional
    public WalletCategoryDTO updateWalletCategoryLimit(UUID walletId, Long categoryId, UpdateWalletCategoryRequest request) {
        WalletCategory existing = walletCategoryRepository
                .findByWalletIdAndCategoryId(walletId, categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category limit not found"));
        walletCategoryRepository.delete(existing);

        Wallet wallet = findOwnedWallet(walletId);
        Category newCategory = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        WalletCategory walletCategory = new WalletCategory();
        walletCategory.setId(new WalletCategoryId(walletId, request.categoryId()));
        walletCategory.setWallet(wallet);
        walletCategory.setCategory(newCategory);
        walletCategory.setSpendingLimit(request.spendingLimit());
        walletCategory.setSpent(existing.getSpent());

        return walletCategoryMapper.toDTO(walletCategoryRepository.save(walletCategory));
    }

    @Transactional
    public void deleteWalletCategoryLimit(UUID walletId, Long categoryId) {
        WalletCategory walletCategory = walletCategoryRepository
                .findByWalletIdAndCategoryId(walletId, categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category limit not found"));
        walletCategoryRepository.delete(walletCategory);
    }

    private Wallet findOwnedWallet(UUID id) {
        return walletRepository.findByIdAndUser(id, authService.currentUser())
                .orElseThrow(() -> new ResourceNotFoundException("wallet not found"));
    }
}
