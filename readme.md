
# Sistema de Tradução Assíncrono com Microsserviços

Este projeto implementa um sistema de tradução de textos utilizando uma arquitetura de microsserviços. A aplicação é composta por uma API REST que recebe as solicitações e um serviço de background (worker) que realiza o processamento de forma assíncrona, com comunicação via fila de mensagens.

O design do projeto foca em boas práticas de engenharia de software, resultando em um sistema desacoplado, resiliente e escalável.

## 🏛️ Arquitetura e Conceitos Aplicados

A arquitetura foi desenhada para ser robusta e seguir padrões modernos de desenvolvimento.

- **Microsserviços**: O sistema é dividido em dois serviços independentes: translation-api e translation-worker.
- **Arquitetura Orientada a Eventos**: A comunicação entre os serviços é 100% assíncrona e baseada em eventos, utilizando o RabbitMQ como message broker. Isso garante total desacoplamento, inclusive em nível de banco de dados.
- **Arquitetura em Camadas (DDD-like)**: Ambos os serviços seguem uma estrutura de camadas (Domain, Application, Infrastructure, Presentation) para uma clara separação de responsabilidades e alta manutenibilidade.
- **API RESTful Nível 3 (HATEOAS)**: A API expõe links de hipermídia em suas respostas, permitindo que os clientes naveguem pela API de forma dinâmica.
- **Containerização**: Todo o ambiente, incluindo os serviços e as dependências (RabbitMQ), é orquestrado com Docker e Docker Compose, garantindo um setup de desenvolvimento rápido e consistente.

## 🛠️ Stack de Tecnologias

- **Backend**: Node.js, Express.js
- **Banco de Dados**: SQLite (gerenciado pelo Prisma ORM)
- **Mensageria**: RabbitMQ
- **Documentação da API**: OpenAPI v3 (via Swagger UI)
- **Tradução**: Google Gemini API
- **Containerização**: Docker & Docker Compose

## 📂 Estrutura do Projeto

```bash
/translation-project
├── /translation-api
│   ├── /prisma         # Configuração e schema do Prisma
│   ├── /src            # Código-fonte da API em camadas
│   ├── Dockerfile      # Dockerfile da API
│   └── ...
├── /translation-worker
│   ├── /src            # Código-fonte do Worker em camadas
│   ├── Dockerfile      # Dockerfile do Worker
│   └── ...
├── .env                # Variáveis de ambiente para o Docker Compose
├── docker-compose.yml  # Orquestração dos containers
└── README.md           # Esta documentação
```

## 🚀 Como Configurar e Executar

Siga os passos abaixo para ter todo o ecossistema rodando na sua máquina local.

### Pré-requisitos
- Docker
- Docker Compose

### 1. Clonar o Repositório

```bash
git clone <URL_DO_SEU_REPOSITORIO>
cd translation-project
```

### 2. Configurar Variáveis de Ambiente

O Docker Compose precisa de uma chave de API para o serviço do Gemini. Crie um arquivo chamado `.env` na raiz do projeto (`translation-project`).

Copie o conteúdo do exemplo abaixo para o seu `.env`:

```plaintext
# Cole sua chave da API do Google AI Studio aqui
GEMINI_API_KEY="SUA_CHAVE_API_DO_GEMINI_AQUI"
# Para sqlite pode manter a url assim
DATABASE_URL="file:./prisma/dev.db"
```

### 3. Subir os Containers

Com o Docker em execução, use um único comando para construir as imagens e iniciar todos os serviços:

```bash
docker-compose up --build
```

A opção `--build` garante que as imagens Docker sejam construídas do zero na primeira vez ou caso haja alguma alteração nos arquivos.

### 4. Verificando se Tudo Está Rodando

Após a execução do comando, você verá os logs dos três containers no seu terminal: rabbitmq, translation-api e translation-worker.

- **API de Tradução**: Estará disponível em [http://localhost:3000](http://localhost:3000).
- **Documentação da API (Swagger)**: Acesse [http://localhost:3000/api-docs](http://localhost:3000/api-docs) no seu navegador.
- **Painel de Gerenciamento do RabbitMQ**: Acesse [http://localhost:15672](http://localhost:15672) (login/senha padrão: guest/guest).

## ⚙️ Como Usar a API

A forma mais fácil de interagir com a API é através da documentação do Swagger. Alternativamente, você pode usar `curl`, `insominia` ou `postman`.

### 1. Criar uma Solicitação de Tradução

Envie uma requisição POST para o endpoint `/translations`.

```bash
curl -X POST http://localhost:3000/translations -H "Content-Type: application/json" -d '{
  "text": "The future of software development is asynchronous and resilient.",
  "targetLanguage": "Português"
}'
```

A resposta será um JSON contendo o `requestId` e os links HATEOAS:

```json
{
  "message": "Solicitação de tradução recebida.",
  "requestId": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
  "_links": {
    "self": {
      "href": "http://localhost:3000/translations/a1b2c3d4-e5f6-7890-1234-567890abcdef",
      "method": "GET"
    }
  }
}
```

### 2. Verificar o Status da Tradução

Use o `requestId` recebido para consultar o status da sua solicitação.

```bash
# Substitua o ID pelo que você recebeu
curl http://localhost:3000/translations/<:id>
```

Consulte algumas vezes e observe o campo `status` mudar de `queued` → `processing` → `completed`.


