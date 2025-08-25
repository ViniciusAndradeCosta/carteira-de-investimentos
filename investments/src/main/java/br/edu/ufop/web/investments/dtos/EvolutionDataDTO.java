package br.edu.ufop.web.investments.dtos;

import java.math.BigDecimal;
import java.time.LocalDate;

public record EvolutionDataDTO(
    LocalDate date,
    BigDecimal totalValue
) {}