package br.edu.ufop.web.investments.domain;

import java.math.BigDecimal;
import java.time.LocalDate;

import br.edu.ufop.web.investments.enums.AssetType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InvestmentDomain {

    private Long id;
    private AssetType type;
    private String symbol;
    private Integer quantity;
    private BigDecimal purchasePrice;
    private LocalDate purchaseDate;

   
}