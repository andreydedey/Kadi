package com.codewithandrey.kadi.category.dto;

public record CategoryDetailDTO(Long id, String name, boolean isStandard, Long globalLimit, Long globalSpent) {
}
