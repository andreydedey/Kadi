package com.codewithandrey.kadi.wallet;

import com.codewithandrey.kadi.auth.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface WalletRepository extends JpaRepository<Wallet, UUID> {

    Page<Wallet> findAllByUser(User user, Pageable pageable);

    Optional<Wallet> findByIdAndUser(UUID id, User user);
}
