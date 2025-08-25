package br.edu.ufop.web.investments.dtos;

import java.math.BigDecimal;
import java.time.LocalDate;

public record PortfolioHistoryDTO(
    LocalDate date,
    BigDecimal totalValue
) {}