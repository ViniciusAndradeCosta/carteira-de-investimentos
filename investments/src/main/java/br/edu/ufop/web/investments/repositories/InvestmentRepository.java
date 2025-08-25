package br.edu.ufop.web.investments.repositories;

import java.util.List;
import java.util.UUID; // Import UUID

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.edu.ufop.web.investments.enums.AssetType;
import br.edu.ufop.web.investments.models.Investment;

@Repository
public interface InvestmentRepository extends JpaRepository<Investment, UUID> { // Change Long to UUID

    List<Investment> findByType(AssetType type);
}