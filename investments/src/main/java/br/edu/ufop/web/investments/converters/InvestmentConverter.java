package br.edu.ufop.web.investments.converters;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import br.edu.ufop.web.investments.domain.InvestmentDomain;
import br.edu.ufop.web.investments.dtos.InvestmentRequestDTO;
import br.edu.ufop.web.investments.dtos.InvestmentResponseDTO;
import br.edu.ufop.web.investments.models.Investment;

@Component
public class InvestmentConverter {

    // DTO de Requisição -> Domínio
    public InvestmentDomain toDomain(InvestmentRequestDTO dto) {
        return InvestmentDomain.builder()
                .type(dto.type())
                .symbol(dto.symbol())
                .quantity(dto.quantity())
                .purchasePrice(dto.purchasePrice())
                .purchaseDate(dto.purchaseDate())
                .build();
    }

    // Domínio -> Modelo (JPA)
    public Investment toModel(InvestmentDomain domain) {
        return Investment.builder()
                .id(domain.getId()) // Agora recebe UUID
                .type(domain.getType())
                .symbol(domain.getSymbol())
                .quantity(domain.getQuantity())
                .purchasePrice(domain.getPurchasePrice())
                .purchaseDate(domain.getPurchaseDate())
                .build();
    }
    
    // Modelo (JPA) -> Domínio
    public InvestmentDomain toDomain(Investment model) {
        return InvestmentDomain.builder()
                .id(model.getId()) // Agora recebe UUID
                .type(model.getType())
                .symbol(model.getSymbol())
                .quantity(model.getQuantity())
                .purchasePrice(model.getPurchasePrice())
                .purchaseDate(model.getPurchaseDate())
                .build();
    }

    // Modelo (JPA) -> DTO de Resposta
    public InvestmentResponseDTO toResponseDto(Investment model) {
        return new InvestmentResponseDTO(
            model.getId(),
            model.getType(),
            model.getSymbol(),
            model.getQuantity(),
            model.getPurchasePrice(),
            model.getPurchaseDate()
        );
    }
    
    // Lista de Modelos (JPA) -> Lista de DTOs de Resposta
    public List<InvestmentResponseDTO> toResponseDtoList(List<Investment> models) {
        return models.stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    // Atualiza um Modelo (JPA) a partir de um Domínio
    public void updateModelFromDomain(Investment model, InvestmentDomain domain) {
        model.setType(domain.getType());
        model.setSymbol(domain.getSymbol());
        model.setQuantity(domain.getQuantity());
        model.setPurchasePrice(domain.getPurchasePrice());
        model.setPurchaseDate(domain.getPurchaseDate());
    }
}