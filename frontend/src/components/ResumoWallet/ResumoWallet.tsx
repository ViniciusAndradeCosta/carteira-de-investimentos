import React, { useMemo } from 'react';
import { type Summary, type Investment, type EvolutionData } from '../../services/api';
import './ResumoWallet.css';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
import { Pie, Line } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

interface ResumoWalletProps {
  summary: Summary | null;
  recentInvestments: Investment[];
  portfolioEvolution: EvolutionData[];
  loading: boolean;
}

const ResumoWallet: React.FC<ResumoWalletProps> = ({ summary, recentInvestments, portfolioEvolution, loading }) => {
    
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    const calculateVariation = (totalValue: number, variationPercentage: number) => {
        if (!totalValue) return { value: 0, percentage: 0, class: 'variation-zero' };

        const variationValue = totalValue * (variationPercentage / 100);
        const variationClass = variationValue >= 0 ? 'positive' : 'negative';

        const sign = variationValue >= 0 ? '+' : '';
        const valueFormatted = formatCurrency(Math.abs(variationValue));
        const percentageFormatted = `${sign}${variationPercentage.toFixed(2)}%`;
        
        return {
            value: valueFormatted,
            percentage: percentageFormatted,
            class: variationClass
        };
    };
    
    // ➡️ CORREÇÃO: A função agora usa 'purchasePrice' e o preço atual (que está no purchasePrice do DTO)
    const calculateProfit = (purchasePrice: number, quantity: number, currentPrice: number) => {
        const totalInvested = purchasePrice * quantity;
        const totalCurrentValue = currentPrice * quantity;
        return totalCurrentValue - totalInvested;
    };
    
    const profitsAndLosses = useMemo(() => {
        return recentInvestments.map(inv => calculateProfit(inv.purchasePrice, inv.quantity, inv.purchasePrice));
    }, [recentInvestments]);

    const colorMap: Record<string, string> = {
        ACAO: '#2f81f7',
        CRIPTO: '#f7b731',
        FUNDO: '#a371f7',
        RENDA_FIXA: '#2da44e'
    };

    const pieChartData = {
        labels: summary ? Object.keys(summary.totalByType).map(type => 
            type.charAt(0).toUpperCase() + type.slice(1).toLowerCase().replace('_', ' ')
        ) : [],
        datasets: [
            {
                label: 'R$ Valor',
                data: summary ? Object.values(summary.totalByType) : [],
                backgroundColor: summary ? Object.keys(summary.totalByType).map(type => colorMap[type]) : [],
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
                label: 'Valor da Carteira (R$)',
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

    const acaoVariation = calculateVariation(summary?.totalByType['ACAO'] || 0, 5.90);
    const criptoVariation = calculateVariation(summary?.totalByType['CRIPTO'] || 0, -4.88);
    const fundoVariation = calculateVariation(summary?.totalByType['FUNDO'] || 0, 5.00);
    const rendaFixaVariation = calculateVariation(summary?.totalByType['RENDA_FIXA'] || 0, 1.50);

    return (
        <div className="resumo-wallet-container">
            <div className="asset-summary-cards">
                <div className="asset-card">
                    <p>Ações</p>
                    <h4>{summary ? formatCurrency(summary.totalByType['ACAO'] || 0) : 'R$ 0,00'}</h4>
                    <div className={`asset-variation ${acaoVariation.class}`}>
                        {acaoVariation.value} ({acaoVariation.percentage})
                    </div>
                </div>
                <div className="asset-card">
                    <p>Criptomoedas</p>
                    <h4>{summary ? formatCurrency(summary.totalByType['CRIPTO'] || 0) : 'R$ 0,00'}</h4>
                    <div className={`asset-variation ${criptoVariation.class}`}>
                        {criptoVariation.value} ({criptoVariation.percentage})
                    </div>
                </div>
                <div className="asset-card">
                    <p>Fundos</p>
                    <h4>{summary ? formatCurrency(summary.totalByType['FUNDO'] || 0) : 'R$ 0,00'}</h4>
                    <div className={`asset-variation ${fundoVariation.class}`}>
                        {fundoVariation.value} ({fundoVariation.percentage})
                    </div>
                </div>
                <div className="asset-card">
                    <p>Renda Fixa</p>
                    <h4>{summary ? formatCurrency(summary.totalByType['RENDA_FIXA'] || 0) : 'R$ 0,00'}</h4>
                    <div className={`asset-variation ${rendaFixaVariation.class}`}>
                        {rendaFixaVariation.value} ({rendaFixaVariation.percentage})
                    </div>
                </div>
            </div>

            <div className="resumo-main-content">
                <div className="top-row">
                    <div className="card-grafico">
                        <h5>Alocação da Carteira</h5>
                        <div className="chart-wrapper">
                            <Pie data={pieChartData} options={pieChartOptions} />
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
                                const profitability = (profit / totalInvestedSingle) * 100;
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
                        {portfolioEvolution.length > 0 ? (
                            <Line data={lineChartData} options={lineChartOptions} />
                        ) : (
                            <div className="grafico-placeholder">
                                <p>Gráfico de Evolução (Dados históricos não disponíveis na API)</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumoWallet;