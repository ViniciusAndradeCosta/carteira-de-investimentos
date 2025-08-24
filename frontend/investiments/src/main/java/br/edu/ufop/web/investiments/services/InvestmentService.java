package br.edu.ufop.web.investiments.services;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.edu.ufop.web.investiments.converters.InvestmentConverter;
import br.edu.ufop.web.investiments.dtos.InvestmentRequestDTO;
import br.edu.ufop.web.investiments.dtos.InvestmentResponseDTO;
import br.edu.ufop.web.investiments.dtos.SummaryDTO;
import br.edu.ufop.web.investiments.enums.AssetType;
import br.edu.ufop.web.investiments.models.Investment;
import br.edu.ufop.web.investiments.repositories.InvestmentRepository;
import jakarta.persistence.EntityNotFoundException;

@Service
public class InvestmentService {

    @Autowired
    private InvestmentRepository investmentRepository;

    @Autowired
    private InvestmentConverter investmentConverter; // Injetando o converter

    @Transactional
    public InvestmentResponseDTO createInvestment(InvestmentRequestDTO requestDto) {
        // Usa o converter para criar a entidade
        Investment investment = investmentConverter.toEntity(requestDto);
        Investment savedInvestment = investmentRepository.save(investment);
        // Usa o converter para criar o DTO de resposta
        return investmentConverter.toResponseDto(savedInvestment);
    }

    @Transactional(readOnly = true)
    public List<InvestmentResponseDTO> getAllInvestments(String type) {
        List<Investment> investments;
        if (type != null && !type.isBlank()) {
            try {
                AssetType assetType = AssetType.valueOf(type.toUpperCase());
                investments = investmentRepository.findByType(assetType);
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Tipo de ativo inválido: " + type);
            }
        } else {
            investments = investmentRepository.findAll();
        }
        // Usa o converter para mapear a lista
        return investmentConverter.toResponseDtoList(investments);
    }

    @Transactional
    public InvestmentResponseDTO updateInvestment(Long id, InvestmentRequestDTO requestDto) {
        Investment investment = investmentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Investimento com ID " + id + " não encontrado."));
        
        // Usa o converter para atualizar a entidade
        investmentConverter.updateEntityFromDto(investment, requestDto);
        
        Investment updatedInvestment = investmentRepository.save(investment);
        return investmentConverter.toResponseDto(updatedInvestment);
    }

    @Transactional
    public void deleteInvestment(Long id) {
        if (!investmentRepository.existsById(id)) {
            throw new EntityNotFoundException("Investimento com ID " + id + " não encontrado.");
        }
        investmentRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public SummaryDTO getSummary() {
        List<Investment> investments = investmentRepository.findAll();
        
        BigDecimal totalInvested = investments.stream()
                .map(inv -> inv.getPurchasePrice().multiply(BigDecimal.valueOf(inv.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, BigDecimal> totalByType = investments.stream()
                .collect(Collectors.groupingBy(
                        inv -> inv.getType().name(),
                        Collectors.mapping(
                                inv -> inv.getPurchasePrice().multiply(BigDecimal.valueOf(inv.getQuantity())),
                                Collectors.reducing(BigDecimal.ZERO, BigDecimal::add)
                        )
                ));

        long assetCount = investments.size();

        return new SummaryDTO(totalInvested, totalByType, assetCount);
    }
}