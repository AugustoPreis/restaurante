# Restaurante
Sistema desenvolvido para gestão de mesas em restaurantes

## Pré-requisitos

Antes de começar, certifique-se de ter as seguintes ferramentas instaladas:

- Node.js 20.x
- NPM ou Yarn
- Git

## Instalação

Clone este repositório para a sua máquina local:

```bash
git clone https://github.com/AugustoPreis/restaurante.git
cd restaurante
```

## Back-end (Node.js com Typescript)

Instale as dependências do servidor:

```bash
cd backend
npm install
```

Criar um arquivo `.env` na pasta `backend` (alterar os valores conforme necessário)
```
PORT=3000
JWT_TOKEN=cin12u3i9c9mind89hfb981nfcsdafaklsfb
LOG_SQL=FALSE
JWT_EXPIRE=1d
AES_256_CBC_KEY=w5DHNKOdgw/MGUNNMMPX4xogvqWel1xOkcOXAAYniSurFTs7HtyOlMktWqjcRrh/
NODE_ENV=DEV

#Informar os dados do banco conforme necessário
DB_HOST=
DB_NAME=
DB_PASS=
DB_USER=
```

Para iniciar o servidor de desenvolvimento:

```bash
npm start
```

## Front-end (React)

Instale as dependências do front-end:

```bash
cd frontend
npm install
```

Para iniciar o front-end em modo de desenvolvimento:

```bash
npm run dev
```

## Funcionalidades implementadas:
- Cadastros (Categorias, Produtos, Mesas e Usuários)
- Gestão de Mesas/Pedidos

## Em desenvolvimento:
- Movimentação de Estoque

## TODO
- Relatórios
- Socket para sincronizar pedidos
