package br.edu.ufop.web.investiments.models;

import java.math.BigDecimal;
import java.time.LocalDate;

import br.edu.ufop.web.investiments.enums.AssetType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Table(name = "investments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Investment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AssetType type;

    @Column(nullable = false)
    private String symbol;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private BigDecimal purchasePrice;

    @Column(nullable = false)
    private LocalDate purchaseDate;
}