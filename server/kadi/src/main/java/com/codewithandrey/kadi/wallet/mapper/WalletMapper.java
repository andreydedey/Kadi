package com.codewithandrey.kadi.wallet.mapper;

import com.codewithandrey.kadi.wallet.Wallet;
import com.codewithandrey.kadi.wallet.dto.CreateWalletRequest;
import com.codewithandrey.kadi.wallet.dto.WalletDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface WalletMapper {
    Wallet toEntity(WalletDTO dto);
    Wallet toEntity(CreateWalletRequest createWalletRequest);

    WalletDTO toDTO(Wallet entity);
}
