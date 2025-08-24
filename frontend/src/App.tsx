import { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import MyInvestments from './components/MyInvestments/MyInvestments';
import ResumoWallet from './components/ResumoWallet/ResumoWallet';
import Toast from './components/Toast/Toast';
import './App.css';
import { getSummary, getInvestments, getPortfolioEvolution, type Summary, type Investment, type EvolutionData } from './services/api';

interface HeaderData {
  patrimonioTotal: number;
  dailyVariation: {
    value: number;
    percentage: number;
  };
}

function App() {
  const [currentView, setCurrentView] = useState<'resumo' | 'investments'>('resumo');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [toastInfo, setToastInfo] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  const [headerData, setHeaderData] = useState<HeaderData | null>(null);
  const [investmentsData, setInvestmentsData] = useState<Investment[]>([]);
  const [summaryData, setSummaryData] = useState<Summary | null>(null);
  const [portfolioEvolutionData, setPortfolioEvolutionData] = useState<EvolutionData[]>([]);
  const [loading, setLoading] = useState(true);

  const [patrimonioTotalFixo, setPatrimonioTotalFixo] = useState(0);

  const calculateTotalProfit = (investments: Investment[]) => {
      return investments.reduce((acc, inv) => {
          const randomVariation = (Math.random() * 20 - 10) / 100;
          const totalInvested = inv.purchasePrice * inv.quantity;
          const totalCurrentValue = totalInvested * (1 + randomVariation);
          return acc + (totalCurrentValue - totalInvested);
      }, 0);
  };
  
  const fetchAllData = async () => {
    try {
      const summary = await getSummary();
      setSummaryData(summary);
      
      const investments = await getInvestments();
      setInvestmentsData(investments);
      
      const evolution = await getPortfolioEvolution();
      setPortfolioEvolutionData(evolution);

      const totalProfit = calculateTotalProfit(investments);
      const totalInvested = investments.reduce((acc, inv) => acc + (inv.purchasePrice * inv.quantity), 0);
      
      const dailyVariationPercentage = (totalProfit / totalInvested) * 100;

      setHeaderData({
        patrimonioTotal: patrimonioTotalFixo,
        dailyVariation: {
          value: totalProfit,
          percentage: dailyVariationPercentage
        }
      });
      
    } catch (error) {
      console.error("Falha ao buscar dados do resumo:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [patrimonioTotalFixo]);

  useEffect(() => {
      const intervalId = setInterval(() => {
          fetchAllData();
      }, 3000);

      return () => clearInterval(intervalId);
  }, [patrimonioTotalFixo]);


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
              onInvestmentsChange={fetchAllData}
              investments={investmentsData}
              loading={loading}
              setPatrimonioTotal={setPatrimonioTotalFixo}
            />
          )}
          {currentView === 'resumo' && (
            <ResumoWallet 
              summary={summaryData}
              recentInvestments={recentInvestments}
              portfolioEvolution={portfolioEvolutionData}
              loading={loading}
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