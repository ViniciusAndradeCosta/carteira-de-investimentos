package br.edu.ufop.web.investiments.dtos;

import java.math.BigDecimal;
import java.util.Map;

public record SummaryDTO(
    BigDecimal totalInvested,
    Map<String, BigDecimal> totalByType,
    long assetCount
) {}
