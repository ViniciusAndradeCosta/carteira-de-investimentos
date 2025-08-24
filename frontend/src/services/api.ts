import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3400',
});

// Tipos...
export interface Investment {
  id: number;
  type: 'ACAO' | 'CRIPTO' | 'FUNDO' | 'RENDA_FIXA' | 'OUTRO';
  symbol: string;
  quantity: number;
  purchasePrice: number;
  purchaseDate: string;
}

export type NewInvestmentData = Omit<Investment, 'id'>;

export interface Summary {
  totalInvested: number;
  totalByType: { [key: string]: number };
  assetCount: number;
}

// Funções da API
export const getInvestments = (): Promise<Investment[]> =>
  api.get('/investments').then(response => response.data);

export const getSummary = (): Promise<Summary> =>
  api.get('/investments/summary').then(response => response.data);

export const createInvestment = (data: NewInvestmentData): Promise<Investment> =>
  api.post('/investments', data).then(response => response.data);

// 🔹 NOVA FUNÇÃO PARA EDIÇÃO
export const updateInvestment = (id: number, data: NewInvestmentData): Promise<Investment> =>
  api.put(`/investments/${id}`, data).then(response => response.data);

// 🔹 SE PRECISAR EXCLUIR
export const deleteInvestment = (id: number): Promise<void> =>
  api.delete(`/investments/${id}`).then(response => response.data);
