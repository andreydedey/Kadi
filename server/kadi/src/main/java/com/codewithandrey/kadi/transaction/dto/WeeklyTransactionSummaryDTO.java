package com.codewithandrey.kadi.transaction.dto;

import java.time.LocalDate;
import java.util.List;

public record WeeklyTransactionSummaryDTO(
        String weekLabel,
        LocalDate startDate,
        LocalDate endDate,
        long totalExpense,
        long totalIncome,
        List<WeeklyCategoryBreakdownDTO> expenseCategories,
        List<WeeklyCategoryBreakdownDTO> incomeCategories
) {
}
