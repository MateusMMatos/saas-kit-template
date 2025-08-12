# CHECKLIST — SaaS Kit (E2E)

Use esta lista para ir do “repo zero” ao deploy em produção.

---

## 0) Pré-requisitos
- [ ] Node LTS + `pnpm`
- [ ] Docker + Docker Compose
- [ ] Conta GitHub
- [ ] Conta Vercel (Web) e provedor para API (Railway/Fly.io/Render etc.)
- [ ] VSCode com: ESLint, Prettier, Prisma, GitLens, EditorConfig

---

## 1) Bootstrap do repositório
- [ ] `git init` e `git remote add origin …`
- [ ] Habilitar **GitHub Actions** (Settings → Actions → Allow)
- [ ] Ativar **branch protection** da `main` (PR obrigatório + CI verde)
- [ ] Copiar/colar o template (ou “Use this template” no GitHub)
- [ ] `pnpm install`

---

## 2) Infra local
- [ ] `docker compose -f infra/docker-compose.yml up -d`
- [ ] Verificar Postgres (5432), Redis (6379) e Mailhog (8025) no ar

---

## 3) Variáveis de ambiente (API)
- [ ] Criar `apps/api/.env` a partir de `.env.example`
- [ ] Definir `DATABASE_URL`, `JWT_SECRET`, `PORT`

---

## 4) Banco de dados
- [ ] `pnpm prisma:dev` (migrações)
- [ ] `pnpm --filter api prisma generate`
- [ ] `pnpm --filter api exec ts-node prisma/seed.ts` (seeds)

---

## 5) Contrato OpenAPI + SDK
- [ ] Editar `openapi.yaml` (primeira feature)
- [ ] `pnpm contract:sdk` (gera `packages/api-client`)
- [ ] (Opcional) `pnpm contract:mock` (Prism mock server)

---

## 6) Dev
- [ ] `pnpm dev` (Web + API em paralelo)
- [ ] Acessar `GET /health` da API e `/` da Web

---

## 7) Testes
- [ ] `pnpm test` (unitários)
- [ ] `pnpm --filter api test:e2e` (e2e)
- [ ] Adicionar/ajustar testes para novas features (unit/integration/e2e)

---

## 8) Padronização (commits e código)
- [ ] Commits no padrão **Conventional Commits** (com `scope`)
- [ ] Husky habilitado (pre-commit: `lint`, `typecheck`, `test`)
- [ ] Nomenclatura: camelCase (funções/vars), PascalCase (classes/tipos), UPPER_SNAKE_CASE (consts), kebab-case (arquivos)
- [ ] Imports absolutos (paths do `tsconfig.base.json`)

---

## 9) CI
- [ ] Confirmar `.github/workflows/ci.yml`
- [ ] Pipeline: `lint` → `typecheck` → `build` → `test`
- [ ] (Opcional) Rodar `contract:lint`/`contract:sdk` no CI

---

## 10) CD — API
- [ ] Setar secrets do repo:
  - [ ] `DEPLOY_API_COMMAND` (ex.: `railway up`, `fly deploy`, `render-cli deploy`)
  - [ ] (Opcional) `REGISTRY_SERVER`, `REGISTRY_USER`, `REGISTRY_PASSWORD`, `REGISTRY_IMAGE`
- [ ] Conferir `apps/api/Dockerfile`
- [ ] Revisar `.github/workflows/cd-api.yml`

---

## 11) CD — Web
- [ ] Setar secrets do repo:
  - [ ] `VERCEL_TOKEN`
  - [ ] `VERCEL_ORG_ID`
  - [ ] `VERCEL_PROJECT_ID`
- [ ] Conferir `apps/web/Dockerfile` (se não usar Vercel)
- [ ] Revisar `.github/workflows/cd-web.yml`

---

## 12) Primeiro deploy
- [ ] Abrir PR com base funcional (healthcheck + auth básica)
- [ ] Merge na `main` dispara CD (API + Web)
- [ ] Validar URLs públicas (Web) e endpoints (API)

---

## 13) Observabilidade e auditoria
- [ ] Logs estruturados (`@core/logger`)
- [ ] Request-ID por requisição
- [ ] Métricas p95/erro/uptime (expor /metrics se usar Prometheus)
- [ ] Registrar eventos críticos no **Audit Log**

---

## 14) Segurança
- [ ] `helmet`, CORS restrito, rate limit por IP/tenant
- [ ] Senhas com `argon2`
- [ ] JWT com refresh + rotação
- [ ] Segredos: **GitHub Environments/Secrets** (nunca commitar `.env`)

---

## 15) Multi-tenant (se aplicável)
- [ ] Ativar `TenantGuard` e `@Tenant()` (header `x-tenant-id` ou subdomínio)
- [ ] Definir isolamento (db-per-tenant ou schema-per-tenant)
- [ ] Ajustar fábrica do Prisma para múltiplos tenants

---

## 16) Billing e Webhooks (se aplicável)
- [ ] Escolher adapter (Stripe/Pagar.me/Mercado Pago/Asaas/PIX)
- [ ] Implementar webhook com **idempotência**
- [ ] Dunning básico (lembretes automáticos para `past_due`)

---

## 17) Feature Flags
- [ ] Ativar via env (ex.: `FF_BILLING_ENABLED=true`, `FF_AUTH_MFA=true`)
- [ ] Usar `getFeature('...')` para gates no backend/frontend

---

## 18) Documentação (BDD)
- [ ] `docs/requisitos-negocio.md` (Resultados, Capacidades, Regras)
- [ ] `docs/casos-de-uso.md` (fluxos e exceções)
- [ ] `docs/estrutura.md` (decisões/ADRs, observabilidade)
- [ ] Converter **exemplos** (Example Mapping) em **testes**

---

## 19) Frontend (Next.js)
- [ ] Consumir SDK de `packages/api-client`
- [ ] Páginas e fluxo de login/registro
- [ ] Testes com React Testing Library / Playwright (se e2e no front)

---

## 20) Manutenção contínua
- [ ] Releases semânticas (SemVer) + changelog automatizado (ex.: Changesets)
- [ ] Rotina de backups do DB
- [ ] Monitorar custo/uso (MAU, churn, LTV) se Analytics habilitado
- [ ] Revisões de segurança periódicas

---

> **Dica:** Este checklist pode ser adaptado para qualquer projeto, mas está otimizado para SaaS multi-tenant com arquitetura moderna e foco em escalabilidade.