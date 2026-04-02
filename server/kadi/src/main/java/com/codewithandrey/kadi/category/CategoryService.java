package com.codewithandrey.kadi.category;

import com.codewithandrey.kadi.category.dto.CategoryDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class CategoryService {
    private final CategoryRepository categoryRepository;

    public void list(Pageable pageable) {
        return;
    }
}
