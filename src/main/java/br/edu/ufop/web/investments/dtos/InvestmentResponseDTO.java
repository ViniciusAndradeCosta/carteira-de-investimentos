package br.edu.ufop.web.investments.dtos;

import java.math.BigDecimal;
import java.time.LocalDate;

import br.edu.ufop.web.investments.enums.AssetType;
import br.edu.ufop.web.investments.models.Investment;

public record InvestmentResponseDTO(
    Long id,
    AssetType type,
    String symbol,
    Integer quantity,
    BigDecimal purchasePrice,
    LocalDate purchaseDate
) {
    
    public InvestmentResponseDTO(Investment investment) {
        this(
            investment.getId(),
            investment.getType(),
            investment.getSymbol(),
            investment.getQuantity(),
            investment.getPurchasePrice(),
            investment.getPurchaseDate()
        );
    }
}