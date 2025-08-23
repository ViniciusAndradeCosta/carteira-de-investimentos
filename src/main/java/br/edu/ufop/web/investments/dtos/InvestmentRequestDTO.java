package br.edu.ufop.web.investments.dtos;

import java.math.BigDecimal;
import java.time.LocalDate;

import br.edu.ufop.web.investments.enums.AssetType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Positive;

public record InvestmentRequestDTO(
    @NotNull(message = "O tipo do ativo não pode ser nulo")
    AssetType type,

    @NotBlank(message = "O símbolo do ativo não pode ser vazio")
    String symbol,

    @NotNull(message = "A quantidade não pode ser nula")
    @Positive(message = "A quantidade deve ser um número positivo")
    Integer quantity,

    @NotNull(message = "O preço de compra não pode ser nulo")
    @Positive(message = "O preço de compra deve ser positivo")
    BigDecimal purchasePrice,

    @NotNull(message = "A data de compra não pode ser nula")
    @PastOrPresent(message = "A data de compra não pode ser no futuro")
    LocalDate purchaseDate
) {}
