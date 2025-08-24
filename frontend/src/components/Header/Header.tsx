import React from 'react';
import './Header.css';

interface HeaderData {
  patrimonioTotal: number;
  dailyVariation: {
    value: number;
    percentage: number;
  };
}

interface HeaderProps {
  toggleSidebar: () => void;
  headerData: HeaderData | null;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, headerData }) => {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };
    
    const patrimonioTotal = headerData?.patrimonioTotal || 0;
    const patrimonioTotalFormatted = formatCurrency(patrimonioTotal);
    const patrimonioTotalClass = patrimonioTotal >= 0 ? 'positive' : 'negative';

    const dailyVariationValue = headerData?.dailyVariation.value || 0;
    const dailyVariationPercentage = headerData?.dailyVariation.percentage || 0;
    
    const variationText = dailyVariationValue === 0
        ? `R$ 0,00 (0.00%)`
        : `${dailyVariationValue > 0 ? '+' : ''}${formatCurrency(dailyVariationValue)} (${dailyVariationPercentage.toFixed(2)}%)`;

    const variationClass = dailyVariationValue === 0 
        ? 'variation-zero' 
        : dailyVariationValue > 0 
        ? 'positive' 
        : 'negative';

    return (
        <header className="main-header-final">
            <div className="header-left-section">
                <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                </button>
                <div className="main-header-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="1" x2="12" y2="23"></line>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                </div>
                <div className="patrimonio-total">
                    <p>Patrimônio Total</p>
                    <h3 className={patrimonioTotalClass}>{patrimonioTotal >= 0 ? '+' : ''}{patrimonioTotalFormatted}</h3>
                </div>
                <div className="variacao-diaria-pill">
                    <div className="variacao-icon positive-bg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                            <polyline points="17 6 23 6 23 12"></polyline>
                        </svg>
                    </div>
                    <div className="variacao-diaria">
                        <p>Variação em Tempo Real</p>
                        <h3 className={variationClass}>
                          {variationText}
                        </h3>
                    </div>
                </div>
            </div>
            
            <div className="user-info">
                <div className="user-details">
                    <span>Vinícius Andrade</span>
                    <p>22.1.8108</p>
                </div>
                <div className="user-avatar">VA</div>
            </div>
        </header>
    );
};

export default Header;