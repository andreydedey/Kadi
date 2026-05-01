package com.codewithandrey.kadi.transaction;

import com.codewithandrey.kadi.auth.User;
import com.codewithandrey.kadi.wallet.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface TransactionRepository extends JpaRepository<Transaction, UUID> {

    List<Transaction> findByWalletOrderByEventDateDesc(Wallet wallet);

    interface CategorySpent {
        Long getCategoryId();
        Long getTotalSpent();
    }

    @Query("SELECT t.category.id AS categoryId, SUM(t.amount) AS totalSpent " +
           "FROM Transaction t " +
           "WHERE t.wallet.user = :user AND t.type IN :types AND t.category IS NOT NULL " +
           "GROUP BY t.category.id")
    List<CategorySpent> sumSpentGroupedByCategoryForUser(User user, List<TransactionType> types);
}
