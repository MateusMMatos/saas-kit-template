# SaaS Kit — TDD • BDD (Business-Driven) • API-First (TypeScript • NestJS • Next.js • Prisma)

[![CI](https://img.shields.io/github/actions/workflow/status/SEUUSER/SEUREPO/ci.yml?label=CI)](./.github/workflows/ci.yml)
[![CD API](https://img.shields.io/github/actions/workflow/status/SEUUSER/SEUREPO/cd-api.yml?label=CD%20API)](./.github/workflows/cd-api.yml)
[![CD Web](https://img.shields.io/github/actions/workflow/status/SEUUSER/SEUREPO/cd-web.yml?label=CD%20Web)](./.github/workflows/cd-web.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

Template completo para criar e escalar SaaS com **API-First**, **TDD** e **BDD**. Monorepo com **Turborepo**, **NestJS** (API), **Next.js** (Web), **Prisma/PostgreSQL**, **Jest**, **Docker** e **CI/CD** (GitHub Actions).

> Dica: use também o **[CHECKLIST.md](./CHECKLIST.md)** para acompanhar o passo-a-passo do zero ao deploy.

---

## Índice
- [Arquitetura & Pilha](#arquitetura--pilha)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Começando](#começando)
- [Contratos (API-First)](#contratos-api-first)
- [Executando em Desenvolvimento](#executando-em-desenvolvimento)
- [Testes (TDD/BDD)](#testes-tddbdd)
- [CI/CD](#cicd)
- [Docker/Containers](#dockercontainers)
- [Seeds do Prisma](#seeds-do-prisma)
- [Feature Flags](#feature-flags)
- [Módulos de Referência](#módulos-de-referência)
- [Convenções & Contribuição](#convenções--contribuição)
- [Roadmap Sugerido](#roadmap-sugerido)
- [Licença](#licença)

---

## Arquitetura & Pilha
- **TypeScript** em todo o monorepo  
- **NestJS** (API) + **Prisma/PostgreSQL**  
- **Next.js** (App Router) + **Tailwind**  
- **Turborepo** (workspaces)  
- **Jest** (unit/integration/e2e) + Supertest  
- **OpenAPI** (contrato) + **orval** (SDK do front)  
- **GitHub Actions** (CI/CD)  
- **Docker** (multi-stage; imagem prod)  

---

## Estrutura de Pastas

apps/
api/ # NestJS (backend) + Dockerfile
web/ # Next.js (frontend) + Dockerfile
packages/
core/ # env tipado (Zod), logger, errors, feature flags
api-client/ # SDK gerado do OpenAPI (orval)
auth/ tenant/ billing/ notifications/ audit/ files/ analytics/ admin/ # módulos plugáveis
docs/
requisitos-negocio.md
casos-de-uso.md
estrutura.md
infra/
docker-compose.yml
openapi.yaml

yaml
Copiar
Editar

---

## Começando
### 1) Clonar e instalar
```bash
git clone https://github.com/SEUUSER/SEUREPO.git
cd SEUREPO
pnpm install
2) Infra local
bash
Copiar
Editar
docker compose -f infra/docker-compose.yml up -d
3) Variáveis de ambiente (API)
Crie apps/api/.env baseado em apps/api/.env.example:

ini
Copiar
Editar
DATABASE_URL=postgresql://app:app@localhost:5432/app
JWT_SECRET=troque_para_um_segredo_longo
PORT=3001
4) Banco de dados
bash
Copiar
Editar
pnpm prisma:dev
pnpm --filter api prisma generate
pnpm --filter api exec ts-node prisma/seed.ts
Passo a passo completo? Veja o CHECKLIST.md.

Contratos (API-First)
Edite openapi.yaml para definir/atualizar endpoints e DTOs.

Gere o SDK do front com orval:

bash
Copiar
Editar
pnpm contract:sdk
(Opcional) Servidor mock do contrato:

bash
Copiar
Editar
pnpm contract:mock
Executando em Desenvolvimento
bash
Copiar
Editar
pnpm dev   # roda API e Web em paralelo
API: http://localhost:3001/health

Web: http://localhost:3000/

Testes (TDD/BDD)
Unitários (regras/domínio), integração (controllers + DB), e2e (fluxos).

bash
Copiar
Editar
pnpm test                # todos
pnpm --filter api test:e2e
Exemplos inclusos:

/auth/register e /auth/login (unit/integration/e2e)

/health (e2e)

@core/env (unit)

Use Example Mapping (em docs/) para derivar testes a partir de regras de negócio.

CI/CD
CI
Workflow: .github/workflows/ci.yml

Jobs: lint → typecheck → build → test (e validações de contrato, se habilitadas)

CD — API
Workflow: .github/workflows/cd-api.yml

Configure Secrets do repositório:

DEPLOY_API_COMMAND (ex.: railway up, fly deploy, render-cli deploy)

(Opcional) Registry: REGISTRY_SERVER, REGISTRY_USER, REGISTRY_PASSWORD, REGISTRY_IMAGE

CD — Web
Workflow: .github/workflows/cd-web.yml

Para Vercel CLI, defina:

VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID

Docker/Containers
Imagens de produção prontas (multi-stage):

API: apps/api/Dockerfile

Web: apps/web/Dockerfile

Ignorados comuns: ver .dockerignore.

Seeds do Prisma
Script em apps/api/prisma/seed.ts cria um admin inicial para desenvolvimento.
Configure o comando de seed em apps/api/package.json ("prisma": { "seed": "ts-node prisma/seed.ts" }).

Feature Flags
Implementação simples em packages/core/src/feature-flags.ts:

ts
Copiar
Editar
import { getFeature } from '@core/feature-flags';
if (getFeature('billing.enabled')) { /* liberar rotas premium */ }
Ative via env:

ini
Copiar
Editar
FF_BILLING_ENABLED=true
FF_AUTH_MFA=true
Módulos de Referência
Auth: registro/login, convites, RBAC, MFA

Tenant: subdomínio/header, guards, migrações

Billing: planos, checkout, webhooks, dunning

Notifications: email/SMS/WhatsApp (adapters)

Audit: trilhas de ações críticas

Files: S3 presigned, regras por plano

Analytics: eventos de produto (MAU, churn, LTV)

Admin: painel interno

Exemplos de código base e testes de referência estão descritos no playbook e podem ser copiados para apps/api/src/** e packages/**.

Convenções & Contribuição
Commits: Conventional Commits (com scope por domínio)

scss
Copiar
Editar
feat(auth): enable MFA
fix(billing): idempotency on webhook
chore(ci): bump Node 20.x
Nomenclatura

Funções/variáveis: camelCase

Classes/Tipos/Interfaces: PascalCase

Constantes: UPPER_SNAKE_CASE

Arquivos: kebab-case.ts (componentes React em PascalCase.tsx)

Pastas: por feature/domínio (domain/, infra/, app/, tests/)

Imports: absolutos via tsconfig.base.json (@core/*, @auth/* etc.)

Husky: pre-commit roda lint, typecheck, test

Guia: ver CONTRIBUTING.md e docs/conventions/

Roadmap Sugerido
Core + Tenant + Auth (contrato + TDD) — primeira entrega

Billing (trial + checkout + webhooks + dunning)

Notifications (transacionais + preferências)

Audit + Admin (backoffice + trilhas)

Files + Webhooks outbound (assinatura HMAC)

Analytics + Relatórios (dashboards/exports)

📄 Licença
Este projeto está licenciado sob a MIT License.