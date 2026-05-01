package com.codewithandrey.kadi.category;

import com.codewithandrey.kadi.auth.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "user_category_limits")
public class UserCategoryLimit {

    @EmbeddedId
    private UserCategoryLimitId id;

    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @MapsId("categoryId")
    @JoinColumn(name = "category_id")
    private Category category;

    @Column(name = "limit_amount", nullable = false)
    private Long limit;
}
