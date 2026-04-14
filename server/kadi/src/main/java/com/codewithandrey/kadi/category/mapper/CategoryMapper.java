package com.codewithandrey.kadi.category.mapper;

import com.codewithandrey.kadi.category.Category;
import com.codewithandrey.kadi.category.dto.CategoryDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    CategoryDTO toDTO(Category category);
}
