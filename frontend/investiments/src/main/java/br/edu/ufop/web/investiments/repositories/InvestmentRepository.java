package br.edu.ufop.web.investiments.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.edu.ufop.web.investiments.enums.AssetType;
import br.edu.ufop.web.investiments.models.Investment;

@Repository
public interface InvestmentRepository extends JpaRepository<Investment, Long> {


    List<Investment> findByType(AssetType type);
}
