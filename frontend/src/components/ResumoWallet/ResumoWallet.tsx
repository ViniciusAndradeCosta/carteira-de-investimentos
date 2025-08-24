import React, { useMemo } from 'react';
import { type Summary, type Investment, type EvolutionData } from '../../services/api';
import './ResumoWallet.css';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
import { Pie, Line } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

interface ResumoWalletProps {
  summary: Summary | null;
  investments: Investment[];
  recentInvestments: Investment[];
  portfolioEvolution: EvolutionData[];
  loading: boolean;
  currentPrices: Map<string, number>; // Corrigido para <string, number>
}

const ResumoWallet: React.FC<ResumoWalletProps> = ({ summary, investments, recentInvestments, portfolioEvolution, loading, currentPrices }) => {
    
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    const totalCurrentValueByType = useMemo(() => {
        const totals: { [key: string]: number } = {
            ACAO: 0,
            CRIPTO: 0,
            FUNDO: 0,
            RENDA_FIXA: 0,
        };
  
        investments.forEach(inv => {
            const currentPrice = currentPrices.get(inv.id) || inv.purchasePrice; // Agora funciona com id: string
            const currentValue = currentPrice * inv.quantity;
            if (totals[inv.type] !== undefined) {
                totals[inv.type] += currentValue;
            }
        });
  
        return totals;
    }, [investments, currentPrices]);

    const calculateProfit = (purchasePrice: number, quantity: number, currentPrice: number) => {
        const totalInvested = purchasePrice * quantity;
        const totalCurrentValue = currentPrice * quantity;
        return totalCurrentValue - totalInvested;
    };
    
    const profitsAndLosses = useMemo(() => {
        return recentInvestments.map(inv => {
            const currentPrice = currentPrices.get(inv.id) || inv.purchasePrice; // Agora funciona com id: string
            return calculateProfit(inv.purchasePrice, inv.quantity, currentPrice);
        });
    }, [recentInvestments, currentPrices]);

    const colorMap: Record<string, string> = {
        ACAO: '#2f81f7',
        CRIPTO: '#f7b731',
        FUNDO: '#a371f7',
        RENDA_FIXA: '#2da44e'
    };

    const pieChartData = {
        labels: Object.keys(totalCurrentValueByType).map(type => 
            type.charAt(0).toUpperCase() + type.slice(1).toLowerCase().replace('_', ' ')
        ),
        datasets: [
            {
                label: 'R$ Valor',
                data: Object.values(totalCurrentValueByType),
                backgroundColor: Object.keys(totalCurrentValueByType).map(type => colorMap[type]),
                borderColor: '#161b22',
                borderWidth: 2,
            },
        ],
    };

    const pieChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: function(context: any) {
                        return `${context.label}: ${formatCurrency(context.parsed)}`;
                    }
                }
            }
        },
        layout: {
            padding: 10
        }
    };
    
    const lineChartData = {
        labels: portfolioEvolution.map(data => new Date(data.date).toLocaleDateString('pt-BR')),
        datasets: [
            {
                label: 'Patrimônio Total (R$)',
                data: portfolioEvolution.map(data => data.totalValue),
                fill: true,
                backgroundColor: 'rgba(45, 164, 78, 0.2)',
                borderColor: '#2da44e',
                tension: 0.4,
                pointRadius: 5,
                pointBackgroundColor: '#2da44e',
                pointHoverRadius: 7,
            }
        ]
    };

    const lineChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: function(context: any) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += formatCurrency(context.parsed.y);
                        }
                        return label;
                    }
                }
            },
        },
        scales: {
            x: {
                grid: {
                    color: '#21262d'
                },
                ticks: {
                    color: '#8d96a0'
                }
            },
            y: {
                beginAtZero: false,
                grid: {
                    color: '#21262d'
                },
                ticks: {
                    color: '#8d96a0',
                    callback: function(value: any, _index: any, _ticks: any) {
                        return formatCurrency(value);
                    }
                }
            }
        }
    };

    if (loading) return <div className="loading-message">Carregando...</div>;

    const getVariationDisplay = (assetType: string) => {
        const initialValue = summary?.totalByType[assetType] || 0;
        const currentValue = totalCurrentValueByType[assetType] || 0;

        if (initialValue === 0 && currentValue === 0) {
            return <div className="asset-variation variation-zero">R$ 0,00 (0.00%)</div>;
        }
        
        const variationValue = currentValue - initialValue;
        const variationPercentage = initialValue > 0 ? (variationValue / initialValue) * 100 : 0;
        const variationClass = variationValue >= 0 ? 'positive' : 'negative';
        
        return (
            <div className={`asset-variation ${variationClass}`}>
                {variationValue >= 0 ? '+' : ''}{formatCurrency(variationValue)} ({variationPercentage.toFixed(2)}%)
            </div>
        );
    };

    return (
        <div className="resumo-wallet-container">
            <div className="asset-summary-cards">
                <div className="asset-card">
                    <p>Ações</p>
                    <h4>{formatCurrency(totalCurrentValueByType['ACAO'] || 0)}</h4>
                    {getVariationDisplay('ACAO')}
                </div>
                <div className="asset-card">
                    <p>Criptomoedas</p>
                    <h4>{formatCurrency(totalCurrentValueByType['CRIPTO'] || 0)}</h4>
                    {getVariationDisplay('CRIPTO')}
                </div>
                <div className="asset-card">
                    <p>Fundos</p>
                    <h4>{formatCurrency(totalCurrentValueByType['FUNDO'] || 0)}</h4>
                    {getVariationDisplay('FUNDO')}
                </div>
                <div className="asset-card">
                    <p>Renda Fixa</p>
                    <h4>{formatCurrency(totalCurrentValueByType['RENDA_FIXA'] || 0)}</h4>
                    {getVariationDisplay('RENDA_FIXA')}
                </div>
            </div>

            <div className="resumo-main-content">
                <div className="top-row">
                    <div className="card-grafico">
                        <h5>Alocação da Carteira</h5>
                        <div className="chart-wrapper">
                            <Pie data={pieChartData} options={pieChartOptions as any} />
                        </div>
                        <div className="custom-legend">
                            <span><span className="legend-dot acoes"></span> Ações</span>
                            <span><span className="legend-dot cripto"></span> Criptomoedas</span>
                            <span><span className="legend-dot fundos"></span> Fundos</span>
                            <span><span className="legend-dot renda-fixa"></span> Renda Fixa</span>
                        </div>
                    </div>

                    <div className="card-recentes">
                        <h5>Investimentos Recentes</h5>
                        <ul>
                            {recentInvestments.map((inv, index) => {
                                const profit = profitsAndLosses[index];
                                const totalInvestedSingle = inv.purchasePrice * inv.quantity;
                                const currentValue = totalInvestedSingle + profit;
                                const profitability = totalInvestedSingle > 0 ? (profit / totalInvestedSingle) * 100 : 0;
                                return (
                                    <li key={inv.id}>
                                        <div className='info-principal'>
                                            <span className={`symbol-circle symbol-color-${inv.type.toLowerCase().replace('_', '-')}`}>
                                                {inv.symbol.substring(0, 2)}
                                            </span>
                                            <div className="investment-info">
                                                <span>{inv.symbol}</span>
                                                <p>{inv.quantity} un.</p>
                                            </div>
                                        </div>
                                        <div className="recent-values">
                                            <span className="investment-amount">{formatCurrency(currentValue)}</span>
                                            <span className={`recent-variation ${profit >= 0 ? 'positive' : 'negative'}`}>
                                                {profit >= 0 ? '+' : ''}{profitability.toFixed(2)}%
                                            </span>
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </div>
                
                <div className="card-grafico card-evolucao">
                    <h5>Evolução da Carteira</h5>
                    <div className="chart-wrapper">
                        {portfolioEvolution.length > 1 ? (
                            <Line data={lineChartData} options={lineChartOptions as any} />
                        ) : (
                            <div className="grafico-placeholder">
                                <p>Realize mais transações para ver a evolução da sua carteira.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumoWallet;