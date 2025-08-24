import React, { useState, useEffect, useMemo, useRef } from 'react';
import { getInvestments, type Investment } from '../../services/api';
import AddNewInvestmentModal from '../Form/AddNewInvestmentModal';
import './MyInvestments.css';

interface MyInvestmentsProps {
    showToast: (message: string, type: 'success' | 'error') => void;
}

const MyInvestments: React.FC<MyInvestmentsProps> = ({ showToast }) => {
    const [investments, setInvestments] = useState<Investment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedType, setSelectedType] = useState<string>('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const filterRef = useRef<HTMLDivElement>(null);

    const fetchInvestments = async () => {
        try {
            setLoading(true);
            const data = await getInvestments();
            setInvestments(data);
        } catch (err) {
            setError('Falha ao buscar investimentos.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setIsFilterOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => { document.removeEventListener("mousedown", handleClickOutside); };
    }, []);

    useEffect(() => {
        fetchInvestments();
    }, []);

    const displayedInvestments = useMemo(() => {
        let results = investments;
        if (selectedType !== 'ALL') {
            results = results.filter(inv => inv.type === selectedType);
        }
        if (searchQuery.trim() !== '') {
            results = results.filter(inv =>
                inv.symbol.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        return results;
    }, [investments, selectedType, searchQuery]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    if (loading) return <div className="loading-message">Carregando...</div>;
    if (error) return <div className="error-message">{error}</div>;
    
    // As variáveis que estavam sendo declaradas, mas não lidas
    const totalValue = investments.reduce((acc, inv) => acc + (inv.purchasePrice * inv.quantity), 0);
    const totalAssets = investments.length;
    const assetTypes = { 'ALL': 'Todos os tipos', 'ACAO': 'Ações', 'CRIPTO': 'Criptomoedas', 'FUNDO': 'Fundos', 'RENDA_FIXA': 'Renda Fixa' };

    return (
        <>
            {isModalOpen && <AddNewInvestmentModal onClose={() => setIsModalOpen(false)} onInvestmentAdded={fetchInvestments} showToast={showToast} />}
            
            <div className="my-investments-page">
                <div className="page-header">
                    <div className="header-main-info">
                        <h1>Meus Investimentos</h1>
                        <p>Gerencie e acompanhe seus ativos</p>
                    </div>
                    <button className="btn-novo-investimento" onClick={() => setIsModalOpen(true)}>
                        + Novo Investimento
                    </button>
                </div>

                <div className="summary-cards">
                    <div className="card">
                        <div className="summary-card-icon icon-bg-blue">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
                        </div>
                        <p>Valor Total</p>
                        {/* ===== CORREÇÃO AQUI ===== */}
                        <h3>{formatCurrency(totalValue)}</h3>
                    </div>
                    <div className="card">
                         <div className="summary-card-icon icon-bg-green">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
                        </div>
                        <p>Lucro/Prejuízo</p>
                        <h3 className="positive">+ R$ 25.752,00</h3>
                    </div>
                    <div className="card">
                        <div className="summary-card-icon icon-bg-green">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
                        </div>
                        <p>Rentabilidade</p>
                        <h3 className="positive">+15.51%</h3>
                    </div>
                    <div className="card">
                        <p>Ativos</p>
                        {/* ===== CORREÇÃO AQUI ===== */}
                        <h3>{totalAssets}</h3>
                    </div>
                </div>

                <div className="filters-search-card">
                    <h4>Filtros e Busca</h4>
                    <div className="filters-content">
                        <div className="search-wrapper">
                            <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            <input 
                                type="text" 
                                placeholder="Buscar por símbolo..." 
                                className="search-input"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="filter-wrapper" ref={filterRef}>
                            <button className="btn-filter" onClick={() => setIsFilterOpen(!isFilterOpen)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                                {assetTypes[selectedType as keyof typeof assetTypes]}
                            </button>
                            {isFilterOpen && (
                                <ul className="filter-dropdown">
                                    {Object.entries(assetTypes).map(([key, value]) => (
                                        <li key={key} onClick={() => { setSelectedType(key); setIsFilterOpen(false); }}>
                                            {value}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>

                <div className="investment-list-container">
                     <h4 className="list-title">Lista de Investimentos</h4>
                    <div className="investment-list-scrollable">
                        {displayedInvestments.map((investment, index) => (
                           <div className="investment-item-card" key={`${investment.id}-${index}`}>
                                <div className="item-info">
                                    <span className={`symbol-box symbol-color-${investment.type.toLowerCase().replace('_', '-')}`}>
                                        {investment.symbol.substring(0, 2)}
                                    </span>
                                    <div className="item-details">
                                        <span className="symbol">{investment.symbol} <span className={`tag tag-${investment.type.toLowerCase().replace('_', '-')}`}>{investment.type}</span></span>
                                        <span className="details-text">{investment.quantity} un. • Compra: {new Date(investment.purchaseDate).toLocaleDateString('pt-BR')}</span>
                                    </div>
                                </div>
                                <div className="item-values">
                                    <h4>{formatCurrency(investment.purchasePrice * investment.quantity)}</h4>
                                    <div className="item-profit positive">
                                        <span>+ R$ 482,00</span>
                                        <span className='percentage'>+24.52%</span>
                                    </div>
                                </div>
                                 <div className="item-menu">
                                    <span>...</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default MyInvestments;