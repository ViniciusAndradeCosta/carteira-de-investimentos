import { useState, useEffect, useMemo } from 'react';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import MyInvestments from './components/MyInvestments/MyInvestments';
import ResumoWallet from './components/ResumoWallet/ResumoWallet';
import Toast from './components/Toast/Toast';
import './App.css';
import { getSummary, getInvestments, type Summary, type Investment, type EvolutionData } from './services/api';

interface HeaderData {
  patrimonioTotal: number;
  dailyVariation: {
    value: number;
    percentage: number;
  };
}

// Representa uma transação de compra ou venda
interface Transaction {
    date: string;
    type: 'buy' | 'sell';
    amount: number;
}

function App() {
  const [currentView, setCurrentView] = useState<'resumo' | 'investments'>('resumo');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [toastInfo, setToastInfo] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  const [investmentsData, setInvestmentsData] = useState<Investment[]>([]);
  const [summaryData, setSummaryData] = useState<Summary | null>(null);
  const [portfolioEvolutionData, setPortfolioEvolutionData] = useState<EvolutionData[]>([]);
  const [loading, setLoading] = useState(true);

  const [patrimonioTotal, setPatrimonioTotal] = useState(0);
  const [currentPrices, setCurrentPrices] = useState(new Map<string, number>());
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const investments = await getInvestments();
      setInvestmentsData(investments);

      const prices = new Map<string, number>();
      investments.forEach(inv => {
        prices.set(inv.id, inv.purchasePrice);
      });
      setCurrentPrices(prices);
      
      const buyTransactions: Transaction[] = investments.map(inv => ({
          date: inv.purchaseDate,
          type: 'buy',
          amount: inv.purchasePrice * inv.quantity,
      }));
      setTransactions(buyTransactions);
      
      await refreshSummary();
      
    } catch (error) {
      console.error("Falha ao buscar dados iniciais:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshInvestmentsAndSummary = async () => {
      try {
          const investments = await getInvestments();
          setInvestmentsData(investments);
          await refreshSummary();
      } catch (error) {
          console.error("Falha ao atualizar lista de investimentos:", error);
      }
  };
  
  const refreshSummary = async () => {
      try {
          const summary = await getSummary();
          setSummaryData(summary);
      } catch(error){
          console.error("Falha ao buscar dados do resumo:", error);
      }
  }


  useEffect(() => {
    fetchInitialData();
  }, []);
  
  useEffect(() => {
    const sortedTransactions = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    let currentPatrimonio = 0;
    const evolution: EvolutionData[] = [];

    if (sortedTransactions.length > 0) {
        const initialDate = new Date(sortedTransactions[0].date);
        initialDate.setDate(initialDate.getDate() - 1);
        evolution.push({ date: initialDate.toISOString().split('T')[0], totalValue: 0 });
    }

    sortedTransactions.forEach(t => {
      if (t.type === 'buy') {
        currentPatrimonio -= t.amount;
      } else {
        currentPatrimonio += t.amount;
      }
      evolution.push({ date: t.date, totalValue: currentPatrimonio });
    });

    setPatrimonioTotal(currentPatrimonio);
    setPortfolioEvolutionData(evolution);

  }, [transactions]);


  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentPrices(prevPrices => {
        const newPrices = new Map(prevPrices);
        investmentsData.forEach(inv => {
          const currentPrice = newPrices.get(inv.id) || inv.purchasePrice;
          const variation = (Math.random() * 0.02 - 0.01);
          const newPrice = currentPrice * (1 + variation);
          newPrices.set(inv.id, newPrice);
        });
        return newPrices;
      });
    }, 3000);

    return () => clearInterval(intervalId);
  }, [investmentsData]);

  const headerData = useMemo<HeaderData | null>(() => {
    if (loading) return null;

    let totalCurrentValue = 0;
    investmentsData.forEach(inv => {
        const currentPrice = currentPrices.get(inv.id) || inv.purchasePrice;
        totalCurrentValue += currentPrice * inv.quantity;
    });

    const totalInvested = investmentsData.reduce((acc, inv) => acc + (inv.purchasePrice * inv.quantity), 0);
    const dailyVariationValue = totalCurrentValue - totalInvested;
    const dailyVariationPercentage = totalInvested > 0 ? (dailyVariationValue / totalInvested) * 100 : 0;

    return {
        patrimonioTotal: patrimonioTotal,
        dailyVariation: {
            value: dailyVariationValue,
            percentage: dailyVariationPercentage,
        },
    };
  }, [investmentsData, currentPrices, patrimonioTotal, loading]);

  const handleInvestmentSold = (sellAmount: number, sellDate: string) => {
      const sellTransaction: Transaction = {
          date: sellDate,
          type: 'sell',
          amount: sellAmount,
      };
      setTransactions(prev => [...prev, sellTransaction]);
      refreshInvestmentsAndSummary();
  };

  const handleInvestmentAdded = (investment: Investment) => {
      const buyTransaction: Transaction = {
          date: investment.purchaseDate,
          type: 'buy',
          amount: investment.purchasePrice * investment.quantity,
      };
      setTransactions(prev => [...prev, buyTransaction]);
      refreshInvestmentsAndSummary();
  }

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToastInfo({ message, type });
  };
  
  const sortedInvestments = investmentsData.sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime());
  const recentInvestments = sortedInvestments.slice(0, 5);

  return (
    <div className={`app-container ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView}
      />
      <div className="content-wrapper">
        <Header 
          toggleSidebar={toggleSidebar} 
          headerData={headerData}
        />
        <main className="main-content">
          {currentView === 'investments' && (
            <MyInvestments 
              showToast={showToast} 
              onInvestmentAdded={handleInvestmentAdded}
              investments={investmentsData}
              loading={loading}
              onInvestmentSold={handleInvestmentSold}
              currentPrices={currentPrices}
            />
          )}
          {currentView === 'resumo' && (
            <ResumoWallet 
              summary={summaryData}
              investments={investmentsData}
              recentInvestments={recentInvestments}
              portfolioEvolution={portfolioEvolutionData}
              loading={loading}
              currentPrices={currentPrices}
            />
          )}
        </main>
      </div>

      {toastInfo && (
        <Toast
          message={toastInfo.message}
          type={toastInfo.type}
          onClose={() => setToastInfo(null)}
        />
      )}
    </div>
  );
}

export default App;