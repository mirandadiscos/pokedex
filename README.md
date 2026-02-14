# Pokedex

Projeto full stack com API em Node.js/Express + TypeORM (SQLite) e frontend em React + Vite para listar e consultar pokemons.

## Estrutura

- `backend/`: API REST, regras de negocio, banco e testes.
- `frontend/`: aplicacao React para listagem e detalhe de pokemons.
- `contracts/`: tipos compartilhados entre backend e frontend.
- `collections/`: requests HTTP para testes manuais.

## Pre-requisitos

- Node.js 20+
- npm 10+

## Instalacao

Instale as dependencias de cada ambiente separadamente:

```bash
cd backend
npm install
```

```bash
cd frontend
npm install
```

## Rodando o backend (terminal 1)

Na primeira execucao, rode o seed para popular o banco SQLite:

```bash
cd backend
npm run db:seed
```

Depois suba a API:

```bash
cd backend
npm run dev
```

API padrao: `http://localhost:3001`

## Rodando o frontend (terminal 2)

```bash
cd frontend
npm run dev
```

Frontend padrao: `http://localhost:5173`

## Testes

Backend:

```bash
cd backend
npm test
```

Frontend:

```bash
cd frontend
npm test
```

## Endpoints principais

- `GET /health`
- `GET /api/pokemons`
- `GET /api/pokemons/:id`

Exemplo com query params:

`GET /api/pokemons?page=1&pageSize=20&search=pika&sortField=name&sortDirection=ASC`

## Collections HTTP

Para testes manuais no VSCode (extensao HTTP Client), use `collections/backend.http`.

## Variaveis de ambiente

Backend:

- `PORT` (padrao: `3001`)
- `CORS_ORIGIN` (padrao: `http://localhost:5173`)

Frontend:

- `VITE_API_BASE_URL` (padrao: `http://localhost:3001`)

## Cache no frontend

- O `pokemon.service` mantem cache em memoria para lista e detalhe.
- TTL de 5 minutos por entrada.
- Se a entrada expira, ela e removida na leitura.
- `forceRefresh: true` ignora o cache e busca dados novos.
- `clearPokemonCache()` limpa ambos os caches.
