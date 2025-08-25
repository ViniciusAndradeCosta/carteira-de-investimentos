# 💼 Carteira de Investimentos

Monorepo full-stack para gerenciar uma **carteira pessoal de investimentos**, com backend em **Java/Spring Boot** e frontend em **React + TypeScript**.  
O objetivo é cadastrar ativos, registrar movimentações (compra/venda/proventos), acompanhar posições, alocação por classe e evolução do patrimônio.

> Projeto acadêmico/experimental — não constitui recomendação de investimento.

---

## 🧭 Sumário

- [Arquitetura & Estrutura](#-arquitetura--estrutura)
- [Principais Funcionalidades](#-principais-funcionalidades)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Como Rodar Localmente](#-como-rodar-localmente)
  - [Backend (API - Spring Boot)](#backend-api---spring-boot)
  - [Frontend (React + Vite)](#frontend-react--vite)
- [Rotas da API (exemplo-base)](#-rotas-da-api-exemplo-base)
- [Scripts Úteis](#-scripts-úteis))

---

## 🏛️ Arquitetura & Estrutura

Monorepo com backend e frontend lado a lado.

```bash
├─ investments/ # Backend (Java + Spring Boot)
├─ frontend/ # Frontend (React + TypeScript + Vite)
├─ .mvn/ # Maven Wrapper
└─ .vscode/ # Configurações de editor
```



**Estilo de arquitetura (alto nível)**  
- **Backend (investments/):** API REST para ativos, transações, posições e relatórios.  
- **Frontend (frontend/):** SPA consumindo a API para cadastro, dashboards e relatórios.

---

## ✨ Principais Funcionalidades

- **Ativos e Posições**
  - Cadastro de ativos (ex.: Ações, ETFs, FIIs, Cripto, Renda Fixa).
  - Consulta de posições consolidadas com **PM médio** e quantidade.
  - Alocação por **classe de ativo** e por **ticker**.

- **Transações**
  - Registro de **compra** e **venda**.
  - Lançamento de **proventos** (dividendos/juros) e **eventos** (split/inplit) — opcional.
  - Histórico de transações com filtros por data/ativo/tipo.

- **Dashboards e Relatórios**
  - Evolução do patrimônio ao longo do tempo.
  - Distribuição por classe/ativo.
  - Indicadores básicos (aporte total, proventos, rentabilidade bruta — quando aplicável).

> Observação: algumas funcionalidades podem estar em desenvolvimento. Ajuste a lista conforme o status do seu código.

---

## 🧰 Tecnologias Utilizadas

**Backend**
- Java 17+
- Spring Boot 3 (Web, Validation, Data JPA/Hibernate)
- Maven (Maven Wrapper incluído)

**Frontend**
- React + TypeScript
- Vite
- React Router DOM

**Outros**
- CSS Modules/Tailwind/Styled (dependendo do projeto)
- ESLint/Prettier (recomendado)

> Se utilizar banco relacional, recomenda-se PostgreSQL em desenvolvimento/produção. Em desenvolvimento local também é comum usar H2 (profile dev).

---

## 🚀 Como Rodar Localmente

### Backend (API - Spring Boot)

1. **Abrir o projeto do backend**
   ```bash
   cd investments
   ```
Configurar banco de dados

PostgreSQL via Docker (exemplo):

```bash
docker run --name carteira-db -e POSTGRES_USER=carteira \
  -e POSTGRES_PASSWORD=carteira -e POSTGRES_DB=carteira \
  -p 5432:5432 -d postgres:16
```
Ajuste as variáveis em application.properties/application.yml ou use variáveis de ambiente (ver seção abaixo).

Alternativamente, se o projeto possuir profile dev com H2, você pode apenas executar sem configurar DB externo.

Executar a API

```bash
./mvnw spring-boot:run
A API deverá subir em http://localhost:8080 (ajuste conforme configuração).
```

Frontend (React + Vite)
Abrir o projeto do frontend

```bash
cd frontend
```
Instalar dependências 

```bash
npm install
# ou
pnpm install
```
Configurar a URL da API
Crie um arquivo .env na pasta Frontend
```bash
VITE_API_URL=http://localhost:8080
Subir o servidor de desenvolvimento
```

```bash
npm run dev
# ou
pnpm dev
```
Acesse em http://localhost:5173.


## 🧾 Rotas da API (exemplo-base)
### Os paths abaixo são sugestões comuns para projetos de carteira. Ajuste conforme seus controllers.

Ativos
```bash
GET /api/assets — lista ativos

POST /api/assets — cadastra ativo

GET /api/assets/{id} — detalhe do ativo

PUT /api/assets/{id} — atualiza ativo

DELETE /api/assets/{id} — remove ativo
```
Transações
```bash
GET /api/transactions — lista transações (filtros por asset, type, from, to)

POST /api/transactions — registra transação (compra, venda, provento)

DELETE /api/transactions/{id} — exclui transação
```
Posições & Relatórios
```bash
GET /api/positions — posições consolidadas (qtd, PM, valor)

GET /api/reports/allocation — alocação por classe/ativo

GET /api/reports/equity — evolução do patrimônio
```
## 🧪 Scripts Úteis
### Backend

```bash
# dentro de /investments
./mvnw clean test
./mvnw spring-boot:run
./mvnw package
```
### Frontend

```bash
# dentro de /frontend
npm run dev
npm run build
npm run preview
```

## 👤 Autor
Projeto mantido por Vinícius Andrade.
Contribuições, sugestões e issues são bem-vindas! 🚀
