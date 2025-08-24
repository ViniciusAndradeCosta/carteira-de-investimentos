import React, { useState, useEffect, useMemo, useRef } from 'react';
import { deleteInvestment, type Investment } from '../../services/api';
import AddNewInvestmentModal from '../Form/AddNewInvestmentModal';
import SellInvestmentModal from '../Form/SellInvestmentModal';
import './MyInvestments.css';

interface MyInvestmentsProps {
    showToast: (message: string, type: 'success' | 'error') => void;
    onInvestmentAdded: (investment: Investment) => void;
    investments: Investment[];
    loading: boolean;
    onInvestmentSold: (sellAmount: number, sellDate: string) => void;
    currentPrices: Map<string, number>;
}

const MyInvestments: React.FC<MyInvestmentsProps> = ({ showToast, onInvestmentAdded, investments, loading, onInvestmentSold, currentPrices }) => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isSellModalOpen, setIsSellModalOpen] = useState(false);
    const [investmentToSell, setInvestmentToSell] = useState<Investment | null>(null);

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedType, setSelectedType] = useState<string>('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const filterRef = useRef<HTMLDivElement>(null);

    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setIsFilterOpen(false);
            }
            if (!(event.target as HTMLElement).closest('.item-menu')) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => { document.removeEventListener("mousedown", handleClickOutside); };
    }, []);
    
    const openSellModal = (investment: Investment) => {
        setInvestmentToSell(investment);
        setIsSellModalOpen(true);
        setOpenMenuId(null);
    };

    const handleConfirmSell = async (sellDate: string) => {
        if (!investmentToSell) return;

        try {
            const currentPrice = currentPrices.get(investmentToSell.id) || investmentToSell.purchasePrice;
            const saleValue = currentPrice * investmentToSell.quantity;
            
            await deleteInvestment(investmentToSell.id);
            onInvestmentSold(saleValue, sellDate);
            
            showToast("Venda concluída com sucesso!", "success");
        } catch (err) {
            showToast("Falha ao vender o investimento.", "error");
            console.error("Erro ao vender investimento:", err);
        }
        setIsSellModalOpen(false);
        setInvestmentToSell(null);
    };
    
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
    
    const calculateProfit = (purchasePrice: number, quantity: number, currentPrice: number) => {
        const totalInvested = purchasePrice * quantity;
        const totalCurrentValue = currentPrice * quantity;
        return totalCurrentValue - totalInvested;
    };
    
    const calculateProfitability = (profit: number, totalInvested: number) => {
        return totalInvested > 0 ? (profit / totalInvested) * 100 : 0;
    }
    
    const profitsAndLosses = useMemo(() => {
        return displayedInvestments.map(inv => {
            const currentPrice = currentPrices.get(inv.id) || inv.purchasePrice;
            return calculateProfit(inv.purchasePrice, inv.quantity, currentPrice);
        });
    }, [displayedInvestments, currentPrices]);
    
    const totalInvested = useMemo(() => displayedInvestments.reduce((acc, inv) => acc + (inv.purchasePrice * inv.quantity), 0), [displayedInvestments]);
    const totalProfit = useMemo(() => profitsAndLosses.reduce((acc, profit) => acc + profit, 0), [profitsAndLosses]);
    const totalProfitability = useMemo(() => calculateProfitability(totalProfit, totalInvested), [totalProfit, totalInvested]);


    if (loading) return <div className="loading-message">Carregando...</div>;

    const totalAssets = investments.length;
    const assetTypes = { 'ALL': 'Todos os tipos', 'ACAO': 'Ações', 'CRIPTO': 'Criptomoedas', 'FUNDO': 'Fundos', 'RENDA_FIXA': 'Renda Fixa' };

    return (
        <>
            {isAddModalOpen && (
                <AddNewInvestmentModal
                    onClose={() => setIsAddModalOpen(false)}
                    onInvestmentAdded={onInvestmentAdded}
                    showToast={showToast}
                />
            )}

            {isSellModalOpen && investmentToSell && (
                <SellInvestmentModal
                    investment={investmentToSell}
                    onClose={() => setIsSellModalOpen(false)}
                    onConfirmSell={handleConfirmSell}
                />
            )}

            <div className="my-investments-page">
                <div className="page-header">
                    <div className="header-main-info">
                        <h1>Meus Investimentos</h1>
                        <p>Gerencie e acompanhe seus ativos</p>
                    </div>
                    <button className="btn-novo-investimento" onClick={() => setIsAddModalOpen(true)}>
                        + Novo Investimento
                    </button>
                </div>

                <div className="summary-cards">
                    <div className="card">
                        <div className="summary-card-icon icon-bg-blue">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
                        </div>
                        <p>Valor Total</p>
                        <h3 className={totalInvested + totalProfit >= totalInvested ? 'positive' : 'negative'}>{formatCurrency(totalInvested + totalProfit)}</h3>
                    </div>
                    <div className="card">
                        <div className={`summary-card-icon ${totalProfit >= 0 ? 'icon-bg-green' : 'icon-bg-red'}`}>
                           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
                        </div>
                        <p>Lucro/Prejuízo</p>
                        <h3 className={totalProfit >= 0 ? 'positive' : 'negative'}>{totalProfit >= 0 ? '+' : ''}{formatCurrency(totalProfit)}</h3>
                    </div>
                    <div className="card">
                        <div className={`summary-card-icon ${totalProfitability >= 0 ? 'icon-bg-green' : 'icon-bg-red'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
                        </div>
                        <p>Rentabilidade</p>
                        <h3 className={totalProfitability >= 0 ? 'positive' : 'negative'}>{totalProfitability >= 0 ? '+' : ''}{totalProfitability.toFixed(2)}%</h3>
                    </div>
                    <div className="card">
                        <p>Ativos</p>
                        <h3>{totalAssets}</h3>
                    </div>
                </div>

                <div className="filters-search-card">
                    <h4>Filtros e Busca</h4>
                    <div className="filters-content">
                        <div className="search-wrapper">
                            <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            <input type="text" placeholder="Buscar por símbolo..." className="search-input" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                        </div>
                        <div className="filter-wrapper" ref={filterRef}>
                            <button className="btn-filter" onClick={() => setIsFilterOpen(!isFilterOpen)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                                {assetTypes[selectedType as keyof typeof assetTypes]}
                            </button>
                            {isFilterOpen && (
                                <ul className="filter-dropdown">
                                    {Object.entries(assetTypes).map(([key, value]) => (
                                        <li key={key} onClick={() => { setSelectedType(key); setIsFilterOpen(false); }}>{value}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>

                <div className="investment-list-container">
                    <h4 className="list-title">Lista de Investimentos</h4>
                    <div className="investment-list-scrollable">
                        {displayedInvestments.map((investment, index) => {
                            const totalInvestedSingle = investment.purchasePrice * investment.quantity;
                            const currentPrice = currentPrices.get(investment.id) || investment.purchasePrice;
                            const profit = calculateProfit(investment.purchasePrice, investment.quantity, currentPrice);
                            const profitability = calculateProfitability(profit, totalInvestedSingle);
                            const currentValue = totalInvestedSingle + profit;
                            return (
                            <div className="investment-item-card" key={`${investment.id}-${index}`}>
                                <div className="item-info">
                                    <span className={`symbol-box symbol-color-${investment.type.toLowerCase().replace('_', '-')}`}>{investment.symbol.substring(0, 2)}</span>
                                    <div className="item-details">
                                        <span className="symbol">
                                            {investment.symbol}
                                            <span className={`tag tag-${investment.type.toLowerCase().replace('_', '-')}`}>{investment.type.replace('_', ' ')}</span>
                                        </span>
                                        <span className="details-text">{investment.quantity} un. • Compra: {new Date(investment.purchaseDate).toLocaleDateString('pt-BR')}</span>
                                    </div>
                                </div>
                                <div className="item-values">
                                    <h4>{formatCurrency(currentValue)}</h4>
                                    <div className={`item-profit ${profit >= 0 ? 'positive' : 'negative'}`}>
                                        <span>{profit >= 0 ? '+' : ''}{formatCurrency(profit)}</span>
                                        <span className={`percentage ${profitability >= 0 ? 'positive' : 'negative'}`}>{`${profitability >= 0 ? '+' : ''}${profitability.toFixed(2)}%`}</span>
                                    </div>
                                </div>
                                <div className="item-menu">
                                    <span onClick={() => setOpenMenuId(openMenuId === investment.id ? null : investment.id)}>⋮</span>
                                    {openMenuId === investment.id && (
                                        <div className="menu-dropdown">
                                            <button onClick={() => openSellModal(investment)} className="sell-button">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                                    <polyline points="19 12 12 19 5 12"></polyline>
                                                </svg>
                                                <span>Vender</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )})}
                    </div>
                </div>
            </div>
        </>
    );
};

export default MyInvestments;