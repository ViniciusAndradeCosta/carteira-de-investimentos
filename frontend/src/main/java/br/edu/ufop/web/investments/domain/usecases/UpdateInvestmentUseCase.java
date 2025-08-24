package br.edu.ufop.web.investments.domain.usecases;

import br.edu.ufop.web.investments.domain.InvestmentDomain;
import lombok.AllArgsConstructor;

@AllArgsConstructor
public class UpdateInvestmentUseCase {

    private final InvestmentDomain investmentDomain;

    public void validate() {
        if (investmentDomain.getId() == null) {
            throw new IllegalArgumentException("ID do investimento não pode ser nulo para atualização.");
        }
        if (investmentDomain.getQuantity() <= 0) {
            throw new IllegalArgumentException("A quantidade deve ser um número positivo.");
        }
    
    }
}