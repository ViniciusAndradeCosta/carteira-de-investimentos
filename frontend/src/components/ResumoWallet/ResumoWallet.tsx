import React, { useState, useEffect } from 'react';
import { getSummary, getInvestments, type Summary, type Investment } from '../../services/api';
import './ResumoWallet.css';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const ResumoWallet: React.FC = () => {
    const [summary, setSummary] = useState<Summary | null>(null);
    const [recentInvestments, setRecentInvestments] = useState<Investment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const summaryData = await getSummary();
                setSummary(summaryData);
                
                const investmentsData = await getInvestments();
                const sortedInvestments = investmentsData.sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime());
                
                // ➡️ ALTERAÇÃO: Agora busca os 5 investimentos mais recentes
                setRecentInvestments(sortedInvestments.slice(0, 5));

            } catch (err) {
                setError('Falha ao buscar dados do resumo da carteira.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    // Mapa de cores para garantir alinhamento com a legenda
    const colorMap: Record<string, string> = {
        ACAO: '#2f81f7',
        CRIPTO: '#f7b731',
        FUNDO: '#a371f7',
        RENDA_FIXA: '#2da44e'
    };

    const chartData = {
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

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            }
        },
        layout: {
            padding: 10
        }
    };

    if (loading) return <div className="loading-message">Carregando...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="resumo-wallet-container">
            <div className="asset-summary-cards">
                <div className="asset-card">
                    <p>Ações</p>
                    <h4>{summary ? formatCurrency(summary.totalByType['ACAO'] || 0) : 'R$ 0,00'}</h4>
                    <div className="asset-variation positive">+ R$ 2.250,00 (+5.90%)</div>
                </div>
                <div className="asset-card">
                    <p>Criptomoedas</p>
                    <h4>{summary ? formatCurrency(summary.totalByType['CRIPTO'] || 0) : 'R$ 0,00'}</h4>
                    <div className="asset-variation negative">- R$ 750,00 (-4.88%)</div>
                </div>
                <div className="asset-card">
                    <p>Fundos</p>
                    <h4>{summary ? formatCurrency(summary.totalByType['FUNDO'] || 0) : 'R$ 0,00'}</h4>
                    <div className="asset-variation positive">+ R$ 1.200,00 (+5.00%)</div>
                </div>
                <div className="asset-card">
                    <p>Renda Fixa</p>
                    <h4>{summary ? formatCurrency(summary.totalByType['RENDA_FIXA'] || 0) : 'R$ 0,00'}</h4>
                    <div className="asset-variation positive">+ R$ 180,00 (+1.50%)</div>
                </div>
            </div>

            <div className="resumo-main-content">
                <div className="top-row">
                    <div className="card-grafico">
                        <h5>Alocação da Carteira</h5>
                        <div className="chart-wrapper">
                            <Pie data={chartData} options={chartOptions} />
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
                            {recentInvestments.map(inv => (
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
                                        <span className="investment-amount">{formatCurrency(inv.purchasePrice * inv.quantity)}</span>
                                        {/* ➡️ ALTERAÇÃO: Substituímos o texto fixo pelos dados dinâmicos */}
                                        <span className="recent-variation positive">+5.40% {new Date(inv.purchaseDate).toLocaleDateString('pt-BR')}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                
                <div className="card-grafico card-evolucao">
                    <h5>Evolução da Carteira</h5>
                    <div className="grafico-placeholder">
                        <p>Gráfico de Evolução (Dados históricos não disponíveis na API)</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumoWallet;