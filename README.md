# Order Manager

Sistema de gerenciamento de pedidos para restaurante com backend NestJS e frontend React.

## Tecnologias Utilizadas

### Backend
- Node.js 22.x
- NestJS 11.x
- TypeScript 5.9.x
- Prisma ORM 6.x
- PostgreSQL 17.x
- Swagger/OpenAPI

### Frontend
- React 18+
- TypeScript 5.9.x
- Vite
- TailwindCSS
- React Router DOM
- Axios

### Infraestrutura
- Docker
- Docker Compose

## Funcionalidades

### Pratos (Menu)
- CRUD completo de pratos
- Campos: nome, descrição, preço, categoria
- Interface para gerenciar o cardápio

### Pedidos
- Criar pedidos com múltiplos pratos
- Cálculo automático do valor total
- Status do pedido: RECEBIDO, EM_PREPARO, PRONTO, ENTREGUE
- Listagem de pedidos com filtro por status
- Atualização de status do pedido

### API REST
- Documentação Swagger disponível em `/api`
- Validação de dados com class-validator
- Tratamento de erros

## Como Executar

### Usando Docker (Recomendado)

1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd order-manager
```

2. Execute o Docker Compose
```bash
docker-compose up --build
```

3. Acesse as aplicações:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- Swagger: http://localhost:3000/api

### Sem Docker

#### Backend

1. Entre na pasta do backend
```bash
cd backend
```

2. Instale as dependências
```bash
npm install
```

3. Configure o arquivo `.env`
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/order_manager?schema=public"
PORT=3000
```

4. Execute as migrations
```bash
npm run prisma:migrate
```

5. Gere o Prisma Client
```bash
npm run prisma:generate
```

6. Inicie o servidor
```bash
npm run start:dev
```

#### Frontend

1. Entre na pasta do frontend
```bash
cd frontend
```

2. Instale as dependências
```bash
npm install
```

3. Crie o arquivo `.env`
```env
VITE_API_URL=http://localhost:3000
```

4. Inicie o servidor de desenvolvimento
```bash
npm run dev
```

## Estrutura do Projeto

```
order-manager/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── pratos/
│   │   ├── pedidos/
│   │   ├── prisma/
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── PratosPage.tsx
│   │   │   ├── CriarPedidoPage.tsx
│   │   │   └── PedidosPage.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── Dockerfile
│   └── package.json
└── docker-compose.yml
```

## Banco de Dados

### Tabelas

#### pratos
- id (UUID)
- nome (String)
- descricao (String)
- preco (Decimal)
- categoria (String)
- created_at (DateTime)
- updated_at (DateTime)

#### pedidos
- id (UUID)
- valor_total (Decimal)
- status (Enum: RECEBIDO, EM_PREPARO, PRONTO, ENTREGUE)
- created_at (DateTime)
- updated_at (DateTime)

#### pedido_pratos
- id (UUID)
- pedido_id (UUID)
- prato_id (UUID)
- quantidade (Int)
- preco_unit (Decimal)
- created_at (DateTime)

## API Endpoints

### Pratos
- `GET /pratos` - Listar todos os pratos
- `GET /pratos/:id` - Buscar prato por ID
- `POST /pratos` - Criar novo prato
- `PATCH /pratos/:id` - Atualizar prato
- `DELETE /pratos/:id` - Deletar prato

### Pedidos
- `GET /pedidos` - Listar todos os pedidos (com filtro opcional por status)
- `GET /pedidos/:id` - Buscar pedido por ID
- `POST /pedidos` - Criar novo pedido
- `PATCH /pedidos/:id/status` - Atualizar status do pedido

## Desenvolvimento

O projeto segue as melhores práticas de desenvolvimento:

- Clean Architecture
- SOLID Principles
- Separation of Concerns
- Type Safety com TypeScript
- Validação de dados
- Commits granulares e semânticos
- Documentação OpenAPI/Swagger

## Licença

MIT