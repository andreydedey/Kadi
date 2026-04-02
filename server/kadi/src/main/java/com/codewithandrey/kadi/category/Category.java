package com.codewithandrey.kadi.category;

import com.codewithandrey.kadi.auth.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "categories")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = true) // NULL = standard
    private User user;

    @OneToMany(mappedBy = "category")
    private List<WalletCategory> walletCategories;
}
