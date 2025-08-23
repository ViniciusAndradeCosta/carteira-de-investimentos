package br.edu.ufop.web.investments.controllers;

import java.net.URI;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import br.edu.ufop.web.investments.dtos.InvestmentRequestDTO;
import br.edu.ufop.web.investments.dtos.InvestmentResponseDTO;
import br.edu.ufop.web.investments.dtos.SummaryDTO;
import br.edu.ufop.web.investments.services.InvestmentService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/investments")
public class InvestmentController {

    @Autowired
    private InvestmentService investmentService;

    @PostMapping
    public ResponseEntity<InvestmentResponseDTO> createInvestment(@Valid @RequestBody InvestmentRequestDTO requestDto) {
        InvestmentResponseDTO responseDto = investmentService.createInvestment(requestDto);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(responseDto.id())
                .toUri();
        return ResponseEntity.created(location).body(responseDto);
    }

    @GetMapping
    public ResponseEntity<List<InvestmentResponseDTO>> getAllInvestments(
            @RequestParam(value = "type", required = false) String type) {
        List<InvestmentResponseDTO> investments = investmentService.getAllInvestments(type);
        return ResponseEntity.ok(investments);
    }

    @GetMapping("/{id}")
    public ResponseEntity<InvestmentResponseDTO> getInvestmentById(@PathVariable Long id) {
        InvestmentResponseDTO investment = investmentService.getInvestmentById(id);
        return ResponseEntity.ok(investment);
    }

    @PutMapping("/{id}")
    public ResponseEntity<InvestmentResponseDTO> updateInvestment(@PathVariable Long id, @Valid @RequestBody InvestmentRequestDTO requestDto) {
        InvestmentResponseDTO updatedInvestment = investmentService.updateInvestment(id, requestDto);
        return ResponseEntity.ok(updatedInvestment);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInvestment(@PathVariable Long id) {
        investmentService.deleteInvestment(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/summary")
    public ResponseEntity<SummaryDTO> getSummary() {
        SummaryDTO summary = investmentService.getSummary();
        return ResponseEntity.ok(summary);
    }
}