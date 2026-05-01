package com.codewithandrey.kadi.category;

import com.codewithandrey.kadi.auth.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserCategoryLimitRepository extends JpaRepository<UserCategoryLimit, UserCategoryLimitId> {

    List<UserCategoryLimit> findByUser(User user);

    Optional<UserCategoryLimit> findByUserAndCategory(User user, Category category);
}
