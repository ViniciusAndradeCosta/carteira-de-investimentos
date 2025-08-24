import React, { useState } from "react";
import { createInvestment, updateInvestment, type Investment, type NewInvestmentData } from "../../services/api";
import "./AddNewInvestmentModal.css";

interface ModalProps {
 onClose: () => void;
 onInvestmentAdded: (savedInvestment: Investment) => void;
 showToast: (message: string, type: "success" | "error") => void;
 investmentToEdit?: Investment | null;
}

const AddNewInvestmentModal: React.FC<ModalProps> = ({
 onClose,
 onInvestmentAdded,
 showToast,
 investmentToEdit,
}) => {
 const [formData, setFormData] = useState({
  type: investmentToEdit?.type || "ACAO",
  symbol: investmentToEdit?.symbol || "",
  quantity: investmentToEdit?.quantity?.toString() || "",
  purchasePrice: investmentToEdit?.purchasePrice?.toString() || "",
  purchaseDate: investmentToEdit?.purchaseDate || "",
 });
 const [error, setError] = useState("");

 const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const { name, value } = e.target;
  setFormData((prevState) => ({ ...prevState, [name]: value }));
 };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");

  if (!formData.symbol || !formData.quantity || !formData.purchasePrice || !formData.purchaseDate) {
   setError("Todos os campos são obrigatórios.");
   return;
  }

  try {
   const investmentData: NewInvestmentData = {
    ...formData,
    type: formData.type as Investment["type"],
    quantity: parseInt(formData.quantity, 10),
    purchasePrice: parseFloat(formData.purchasePrice),
   };

   let savedInvestment;
   if (investmentToEdit) {
    savedInvestment = await updateInvestment(investmentToEdit.id, investmentData);
    showToast("Investimento atualizado com sucesso!", "success");
   } else {
    savedInvestment = await createInvestment(investmentData);
    showToast("Investimento salvo com sucesso!", "success");
   }

   onInvestmentAdded(savedInvestment); 
   onClose();
  } catch (err) {
   showToast("Falha ao salvar investimento.", "error");
   setError("Falha ao salvar investimento. Verifique os dados.");
   console.error(err);
  }
 };

 return (
  <div className="modal-overlay" onClick={onClose}>
   <div className="modal-content" onClick={(e) => e.stopPropagation()}>
    <h2>{investmentToEdit ? "Editar Investimento" : "Adicionar Novo Ativo"}</h2>
    <form onSubmit={handleSubmit}>
     <div className="form-group">
      <label htmlFor="type">Tipo</label>
      <select id="type" name="type" value={formData.type} onChange={handleChange}>
       <option value="ACAO">Ação</option>
       <option value="CRIPTO">Criptomoeda</option>
       <option value="FUNDO">Fundo</option>
       <option value="RENDA_FIXA">Renda Fixa</option>
      </select>
     </div>
     <div className="form-group">
      <label htmlFor="symbol">Símbolo</label>
      <input
       type="text"
       id="symbol"
       name="symbol"
       value={formData.symbol}
       onChange={handleChange}
       placeholder="Ex: PETR4"
      />
     </div>
     <div className="form-group">
      <label htmlFor="quantity">Quantidade</label>
      <input
       type="number"
       id="quantity"
       name="quantity"
       value={formData.quantity}
       onChange={handleChange}
       placeholder="100"
      />
     </div>
     <div className="form-group">
      <label htmlFor="purchasePrice">Preço de Compra (R$)</label>
      <input
       type="number"
       step="0.01"
       id="purchasePrice"
       name="purchasePrice"
       value={formData.purchasePrice}
       onChange={handleChange}
       placeholder="38.50"
      />
     </div>
     <div className="form-group">
      <label htmlFor="purchaseDate">Data da Compra</label>
      <input
       type="date"
       id="purchaseDate"
       name="purchaseDate"
       value={formData.purchaseDate}
       onChange={handleChange}
      />
     </div>

     {error && <p className="error-message">{error}</p>}

     <div className="modal-actions">
      <button type="button" className="btn-cancel" onClick={onClose}>
       Cancelar
      </button>
      <button type="submit" className="btn-save">
       {investmentToEdit ? "Atualizar" : "Salvar"}
      </button>
     </div>
    </form>
   </div>
   </div>
 );
};

export default AddNewInvestmentModal;