import React, { useState, useEffect } from 'react';
import { getSummary, type Summary } from '../../services/api';
import './Header.css';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
    const [summary, setSummary] = useState<Summary | null>(null);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const summaryData = await getSummary();
                setSummary(summaryData);
            } catch (error) {
                console.error("Falha ao buscar dados para o header:", error);
            }
        };
        fetchSummary();
    }, []);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    return (
        <header className="main-header-final">
            <div className="header-left-section">
                <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
                    {/* Ícone de Menu Melhorado */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                </button>
                <div className="main-header-icon">
                    {/* Ícone de Dólar Melhorado */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="1" x2="12" y2="23"></line>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                </div>
                <div className="patrimonio-total">
                    <p>Patrimônio Total</p>
                    <h3>{summary ? formatCurrency(summary.totalInvested) : 'R$ 0,00'}</h3>
                </div>
                <div className="variacao-diaria-pill">
                    <div className="variacao-icon positive-bg">
                        {/* Ícone de Gráfico Melhorado */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                            <polyline points="17 6 23 6 23 12"></polyline>
                        </svg>
                    </div>
                    <div className="variacao-diaria">
                        <p>Variação Diária</p>
                        <h3 className="positive">+ R$ 2.880,00 (+2.97%)</h3>
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