package com.codewithandrey.kadi.wallet;

import com.codewithandrey.kadi.auth.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "wallets")
public class Wallet {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String name;

    @Enumerated(EnumType.STRING)
    private Currency currency;

    private Long balance;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
