package com.codewithandrey.kadi.auth.mapper;

import com.codewithandrey.kadi.auth.User;
import com.codewithandrey.kadi.auth.dto.RegisterRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(target = "password", ignore = true)
    User toEntity(RegisterRequest request);
}
