import React from 'react';
import './Sidebar.css';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: 'resumo' | 'investments') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  return (
    <aside className="sidebar">
        <div className="sidebar-header">
            <div className="logo-icon">$</div>
            <span className="nav-text">Investment Portfolio</span>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li 
              className={currentView === 'resumo' ? 'active' : ''}
              onClick={() => setCurrentView('resumo')}
            >
              <span className="nav-icon">
                {/* Ícone de Carteira Melhorado */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/>
                  <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/>
                  <path d="M18 12a2 2 0 0 0 0 4h4v-4h-4z"/>
                </svg>
              </span>
              <span className="nav-text">Resumo Wallet</span>
            </li>
            <li
              className={currentView === 'investments' ? 'active' : ''}
              onClick={() => setCurrentView('investments')}
            >
              <span className="nav-icon">
                {/* Ícone de Gráfico Melhorado */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="20" x2="12" y2="4"></line>
                    <polyline points="6 10 12 4 18 10"></polyline>
                </svg>
              </span>
              <span className="nav-text">My Investments</span>
            </li>
          </ul>
        </nav>
    </aside>
  );
};

export default Sidebar;