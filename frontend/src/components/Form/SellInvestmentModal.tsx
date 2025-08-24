import React, { useState } from 'react';
import { type Investment } from '../../services/api';
import './AddNewInvestmentModal.css'; // Reutilizando o mesmo CSS do modal de adicionar

interface SellModalProps {
    investment: Investment;
    onClose: () => void;
    onConfirmSell: (sellDate: string) => void;
}

const SellInvestmentModal: React.FC<SellModalProps> = ({ investment, onClose, onConfirmSell }) => {
    const [sellDate, setSellDate] = useState(new Date().toISOString().split('T')[0]);
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!sellDate) {
            setError("A data da venda é obrigatória.");
            return;
        }
        if (new Date(sellDate) < new Date(investment.purchaseDate)) {
            setError("A data da venda não pode ser anterior à data da compra.");
            return;
        }
        onConfirmSell(sellDate);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Vender Ativo: {investment.symbol}</h2>
                <p>Você está vendendo {investment.quantity} unidade(s) deste ativo.</p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="sellDate">Data da Venda</label>
                        <input
                            type="date"
                            id="sellDate"
                            name="sellDate"
                            value={sellDate}
                            onChange={(e) => setSellDate(e.target.value)}
                        />
                    </div>

                    {error && <p className="error-message">{error}</p>}

                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn-save">
                            Confirmar Venda
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SellInvestmentModal;