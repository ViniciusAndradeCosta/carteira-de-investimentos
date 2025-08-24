import { useState } from 'react';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import MyInvestments from './components/MyInvestments/MyInvestments';
import ResumoWallet from './components/ResumoWallet/ResumoWallet';
import Toast from './components/Toast/Toast'; // 1. Importe o Toast
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState<'resumo' | 'investments'>('resumo');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  // 2. Adicione o estado para o Toast
  const [toastInfo, setToastInfo] = useState<{ message: string; type: 'success' | 'error' } | null>(null);


  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // 3. Função para mostrar o toast
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToastInfo({ message, type });
  };

  return (
    <div className={`app-container ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView}
      />
      <div className="content-wrapper">
        <Header toggleSidebar={toggleSidebar} />
        <main className="main-content">
          {currentView === 'investments' && <MyInvestments showToast={showToast} />}
          {currentView === 'resumo' && <ResumoWallet />} 
        </main>
      </div>

      {/* 4. Renderize o Toast quando houver informação para ele */}
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