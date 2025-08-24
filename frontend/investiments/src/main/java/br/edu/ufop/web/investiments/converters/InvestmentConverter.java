package br.edu.ufop.web.investiments.converters;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import br.edu.ufop.web.investiments.dtos.InvestmentRequestDTO;
import br.edu.ufop.web.investiments.dtos.InvestmentResponseDTO;
import br.edu.ufop.web.investiments.models.Investment;


@Component
public class InvestmentConverter {

    /**
     * Converte um DTO de requisição para uma nova Entidade Investment.
     * @param dto O DTO com os dados de entrada.
     * @return Uma nova instância da entidade Investment.
     */
    public Investment toEntity(InvestmentRequestDTO dto) {
        Investment entity = new Investment();
        entity.setType(dto.type());
        entity.setSymbol(dto.symbol());
        entity.setQuantity(dto.quantity());
        entity.setPurchasePrice(dto.purchasePrice());
        entity.setPurchaseDate(dto.purchaseDate());
        return entity;
    }

    /**
     * Converte uma Entidade Investment para um DTO de resposta.
     * @param entity A entidade a ser convertida.
     * @return Um DTO com os dados para serem expostos na API.
     */
    public InvestmentResponseDTO toResponseDto(Investment entity) {
        return new InvestmentResponseDTO(
            entity.getId(),
            entity.getType(),
            entity.getSymbol(),
            entity.getQuantity(),
            entity.getPurchasePrice(),
            entity.getPurchaseDate()
        );
    }

    /**
     * Converte uma lista de Entidades para uma lista de DTOs de resposta.
     * @param entities A lista de entidades.
     * @return Uma lista de DTOs.
     */
    public List<InvestmentResponseDTO> toResponseDtoList(List<Investment> entities) {
        return entities.stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    /**
     * Atualiza uma entidade existente com os dados de um DTO.
     * @param entity A entidade a ser atualizada (vinda do banco).
     * @param dto O DTO com os novos dados.
     */
    public void updateEntityFromDto(Investment entity, InvestmentRequestDTO dto) {
        entity.setType(dto.type());
        entity.setSymbol(dto.symbol());
        entity.setQuantity(dto.quantity());
        entity.setPurchasePrice(dto.purchasePrice());
        entity.setPurchaseDate(dto.purchaseDate());
    }
}