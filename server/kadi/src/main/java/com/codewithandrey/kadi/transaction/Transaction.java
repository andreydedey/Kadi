package com.codewithandrey.kadi.transaction;

import com.codewithandrey.kadi.category.Category;
import com.codewithandrey.kadi.wallet.Wallet;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "wallet_id", nullable = false)
    private Wallet wallet;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType type;

    @Column(nullable = false)
    private Long amount;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne
    @JoinColumn(name = "destination_wallet_id")
    private Wallet destinationWallet;

    private Long destinationAmount;

    private String description;

    @Column(nullable = false)
    private LocalDate eventDate;
}
