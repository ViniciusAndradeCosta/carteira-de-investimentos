package br.edu.ufop.web.investiments.domain;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import br.edu.ufop.web.investiments.enums.AssetType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class InvestmentDomain {

    private Long id;
    private AssetType type;
    private String symbol;
    private Integer quantity;
    private BigDecimal purchasePrice;
    private LocalDate purchaseDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}