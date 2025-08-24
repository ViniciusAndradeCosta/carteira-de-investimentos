package br.edu.ufop.web.investments.domain.usecases;

import br.edu.ufop.web.investments.domain.InvestmentDomain;
import lombok.AllArgsConstructor;

@AllArgsConstructor
public class CreateInvestmentUseCase {

    private final InvestmentDomain investmentDomain;

    public void validate() {
        if (investmentDomain.getSymbol() == null || investmentDomain.getSymbol().isBlank()) {
            throw new IllegalArgumentException("O símbolo do ativo não pode ser vazio.");
        }
        if (investmentDomain.getQuantity() <= 0) {
            throw new IllegalArgumentException("A quantidade deve ser maior que zero.");
        }
        // Outras validações podem ser adicionadas aqui
    }
}