package com.codewithandrey.kadi.category.mapper;

import com.codewithandrey.kadi.category.WalletCategory;
import com.codewithandrey.kadi.category.dto.CreateWalletCategoryRequest;
import com.codewithandrey.kadi.category.dto.WalletCategoryDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface WalletCategoryMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "wallet", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "spent", ignore = true)
    WalletCategory toEntity(CreateWalletCategoryRequest request);

    @Mapping(target = "id", source = "category.id")
    @Mapping(target = "name", source = "category.name")
    WalletCategoryDTO toDTO(WalletCategory entity);
}
