package com.codewithandrey.kadi.subscription.mapper;

import com.codewithandrey.kadi.subscription.Subscription;
import com.codewithandrey.kadi.subscription.dto.SubscriptionDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface SubscriptionMapper {

    SubscriptionDTO toDTO(Subscription subscription);
}
