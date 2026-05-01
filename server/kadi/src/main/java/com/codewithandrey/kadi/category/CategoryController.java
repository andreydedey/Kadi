package com.codewithandrey.kadi.category;

import com.codewithandrey.kadi.category.dto.CategoryDTO;
import com.codewithandrey.kadi.category.dto.CategoryDetailDTO;
import com.codewithandrey.kadi.category.dto.CategoryRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("category")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping("list")
    public ResponseEntity<List<CategoryDTO>> listCategories() {
        return ResponseEntity.ok(categoryService.list());
    }

    @GetMapping
    public ResponseEntity<List<CategoryDetailDTO>> listCategoriesDetail() {
        return ResponseEntity.ok(categoryService.listDetail());
    }

    @PostMapping
    public ResponseEntity<CategoryDetailDTO> createCategory(@RequestBody CategoryRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(categoryService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoryDetailDTO> updateCategory(
            @PathVariable Long id,
            @RequestBody CategoryRequest request
    ) {
        return ResponseEntity.ok(categoryService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoryService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
