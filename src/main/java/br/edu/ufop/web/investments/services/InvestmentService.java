package br.edu.ufop.web.investments.services;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
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
        // 1. Converter DTO para Domínio
        InvestmentDomain investmentDomain = investmentConverter.toDomain(requestDto);

        // 2. Validar com o Caso de Uso
        new CreateInvestmentUseCase(investmentDomain).validate();

        // 3. Converter Domínio para Modelo (JPA) e salvar
        Investment investmentModel = investmentConverter.toModel(investmentDomain);
        Investment savedInvestment = investmentRepository.save(investmentModel);

        // 4. Converter Modelo salvo para DTO de Resposta
        return investmentConverter.toResponseDto(savedInvestment);
    }

    @Transactional
    public InvestmentResponseDTO updateInvestment(Long id, InvestmentRequestDTO requestDto) {
        // 1. Achar a entidade existente
        Investment existingInvestment = investmentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Investimento com ID " + id + " não encontrado."));

        // 2. Converter DTO para Domínio e atribuir o ID
        InvestmentDomain investmentDomain = investmentConverter.toDomain(requestDto);
        investmentDomain.setId(id);

        // 3. Validar com o Caso de Uso
        new UpdateInvestmentUseCase(investmentDomain).validate();
        
        // 4. Atualizar a entidade existente com os dados do domínio
        investmentConverter.updateModelFromDomain(existingInvestment, investmentDomain);
        
        // 5. Salvar e retornar o DTO de resposta
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
    public InvestmentResponseDTO getInvestmentById(Long id) {
        Investment investment = investmentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Investimento com ID " + id + " não encontrado."));
        return investmentConverter.toResponseDto(investment);
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