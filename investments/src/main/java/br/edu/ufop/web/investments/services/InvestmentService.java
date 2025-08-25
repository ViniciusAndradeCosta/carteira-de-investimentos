package br.edu.ufop.web.investments.services;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID; // Import UUID
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.edu.ufop.web.investments.converters.InvestmentConverter;
import br.edu.ufop.web.investments.domain.InvestmentDomain;
import br.edu.ufop.web.investments.domain.usecases.CreateInvestmentUseCase;
import br.edu.ufop.web.investments.domain.usecases.UpdateInvestmentUseCase;
import br.edu.ufop.web.investments.dtos.InvestmentRequestDTO;
import br.edu.ufop.web.investments.dtos.InvestmentResponseDTO;
import br.edu.ufop.web.investments.dtos.SummaryDTO;
import br.edu.ufop.web.investments.enums.AssetType;
import br.edu.ufop.web.investments.models.Investment;
import br.edu.ufop.web.investments.repositories.InvestmentRepository;
import jakarta.persistence.EntityNotFoundException;

@Service
public class InvestmentService {

    @Autowired
    private InvestmentRepository investmentRepository;

    @Autowired
    private InvestmentConverter investmentConverter;

    @Transactional
    public InvestmentResponseDTO createInvestment(InvestmentRequestDTO requestDto) {
        InvestmentDomain investmentDomain = investmentConverter.toDomain(requestDto);
        new CreateInvestmentUseCase(investmentDomain).validate();
        Investment investmentModel = investmentConverter.toModel(investmentDomain);
        Investment savedInvestment = investmentRepository.save(investmentModel);
        return investmentConverter.toResponseDto(savedInvestment);
    }

    @Transactional
    public InvestmentResponseDTO updateInvestment(UUID id, InvestmentRequestDTO requestDto) { // Change Long to UUID
        Investment existingInvestment = investmentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Investimento com ID " + id + " não encontrado."));

        InvestmentDomain investmentDomain = investmentConverter.toDomain(requestDto);
        investmentDomain.setId(id);

        new UpdateInvestmentUseCase(investmentDomain).validate();
        
        investmentConverter.updateModelFromDomain(existingInvestment, investmentDomain);
        
        Investment updatedInvestment = investmentRepository.save(existingInvestment);
        return investmentConverter.toResponseDto(updatedInvestment);
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
        return investmentConverter.toResponseDtoList(investments);
    }

    @Transactional(readOnly = true)
    public InvestmentResponseDTO getInvestmentById(UUID id) { // Change Long to UUID
        Investment investment = investmentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Investimento com ID " + id + " não encontrado."));
        return investmentConverter.toResponseDto(investment);
    }

    @Transactional
    public void deleteInvestment(UUID id) { // Change Long to UUID
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