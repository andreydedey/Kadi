package com.codewithandrey.kadi.transaction.mapper;

import com.codewithandrey.kadi.transaction.Transaction;
import com.codewithandrey.kadi.transaction.dto.TransactionDTO;
import com.codewithandrey.kadi.transaction.dto.TransactionDetailDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TransactionMapper {

    @Mapping(target = "categoryId", source = "category.id")
    @Mapping(target = "destinationWalletId", source = "destinationWallet.id")
    TransactionDTO toDTO(Transaction transaction);

    @Mapping(target = "categoryName", source = "category.name")
    @Mapping(target = "destinationWalletId", source = "destinationWallet.id")
    TransactionDetailDTO toDetailDTO(Transaction transaction);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "wallet", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "destinationWallet", ignore = true)
    Transaction toEntity(TransactionDTO dto);
}
