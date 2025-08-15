# Playbook de Produção de SaaS (API‑First • TDD/BDD • Multi‑tenant • CI/CD)

> **Objetivo**: guiar do *repo zero* ao **deploy em produção** com qualidade e previsibilidade, usando seu template (Turborepo, NestJS + Prisma/PostgreSQL, Next.js, SDK via OpenAPI/orval, Husky/Commitlint, CI/CD no GitHub Actions, Feature Flags, Observabilidade e Auditoria).

---

## 0) Pré‑flight (Dia 0)
- **Ferramentas**: Node LTS + pnpm, Docker Desktop, Git, VS Code.
- **Repos**: crie o repositório no GitHub e ative:
  - Actions: *Settings → Actions → Allow GitHub Actions to run*.
  - Branch protection em `main`: PR obrigatório + checks de CI obrigatórios.
- **Template**: clone/importe o template base; rode `pnpm i`.

### Qualidade de Commit
- **Husky**: hooks `pre-commit` (lint/typecheck/test) e `commit-msg` (commitlint).
- **Commitlint**: Conventional Commits com **scope por domínio** (`feat(auth): ...`).

---

## 1) Foundation (Infra local + Variáveis)
1. **Docker** (DB/Redis/Mailhog):  
   ```bash
   docker compose -f infra/docker-compose.yml up -d
   ```
2. **.env (API)** — `apps/api/.env`:
   ```env
   DATABASE_URL=postgresql://app:app@localhost:5432/app
   JWT_SECRET=<chave longa, >= 32 chars>
   PORT=3001
   ```
3. **Prisma** (migrações + seed):
   ```bash
   pnpm prisma:dev
   pnpm --filter api prisma generate
   pnpm --filter api exec ts-node prisma/seed.ts
   ```

---

## 2) API‑First (Contrato → SDK → Mock)
1. **Especifique a feature** em linguagem de negócio (use `docs/FEATURE_TEMPLATE.md`).
2. **Atualize `openapi.yaml`** (paths, schemas, status codes, exemplos, **códigos de erro estáveis**).
3. **Gere SDK** para o front:
   ```bash
   pnpm contract:sdk
   # opcional para cenários sem backend pronto:
   pnpm contract:mock
   ```
4. **Gate de breaking changes**: valide `contract:lint` (se configurado no CI).

> Dica: use Example Mapping (docs/EXAMPLE_MAPPING.md) para derivar testes.

---

## 3) TDD/BDD (Test‑First)
Ordem sugerida:
1. **Unit (domínio/regra)** — regras puras, erros e validações.
2. **Integração (controller)** — DTO + ValidationPipe + status codes.
3. **E2E (fluxo)** — cenário real (ex.: `register → login`), cobrindo:
   - **Multi‑tenant** (`x-tenant-id` + `where: { tenantId }`).
   - **Feature Flags** (ON/OFF).
   - **Idempotência** (webhooks).

Comandos:
```bash
pnpm test
pnpm --filter api test:e2e
```

---

## 4) Implementação (Gerar com Copilot + Ajustes)
- **Gerar camada**: controller/service/DTOs conforme contrato (**imports absolutos** `@core/...`, DTO com **class-validator**, `ValidationPipe` global).  
- **Autenticação**: hash com **argon2**; JWT (access `15m`, refresh `7d` com rotação).
- **Erros**: **códigos estáveis** (ex.: `AUTH_EMAIL_TAKEN`, `BILLING_DISABLED`).

### Multi‑tenant (obrigatório quando aplicável)
- Decorar handlers com `@UseGuards(TenantGuard)` e `@Tenant()`.
- Todas as consultas Prisma devem **filtrar por `tenantId`**:
  ```ts
  this.prisma.project.findMany({ where: { tenantId } });
  ```
- Estratégia: **db‑per‑tenant** ou **schema‑per‑tenant** (definir no projeto).

### Feature Flags (gate)
- API/Front: `getFeature('dominio.flag')`.
- OFF ⇒ status **403** + código de erro (`..._DISABLED`).
- Cobrir **ON/OFF** nos testes.

### Segurança (mínimos)
- **Helmet**, **CORS restrito**, **rate limit por IP/tenant**.
- Nunca logar **segredos/tokens**.

### Observabilidade e Auditoria
- `@core/logger` com **request-id** e logs estruturados.
- Registrar eventos críticos via `@audit` `{ action, userId, orgId }`.
- (Opcional) expor métricas `/metrics` (Prometheus) e traços (APM).

---

## 5) Frontend (Next.js + SDK)
- Consuma `packages/api-client` (gerado pelo orval).
- **App Router** + **Server Actions** para login/ações sensíveis.
- **Auth cookie**: preferir **httpOnly** (documente caso o boilerplate não tenha).
- **Testes**: React Testing Library (componentes) e Playwright (se e2e no front).

---

## 6) Billing e Webhooks (opcional por produto)
- Adapter (Stripe/Mercado Pago/Pagar.me/Asaas/PIX).  
- **Webhook idempotente**: modelo Prisma `WebhookEvent` com `eventId` **único**.
- Sequência sugerida:
  1. Verificar/assinar evento.
  2. `ensureOnce(event.id)` — retorna falso se já processado.
  3. Processar (assíncrono/leve).
  4. `markProcessed(event.id)`.

---

## 7) CI/CD (verde = permitir merge)
### CI (ex.: `.github/workflows/ci.yml`)
- Etapas: `lint` → `typecheck` → `build` → `test` (+ `contract:sdk`/`contract:lint` quando apropriado).
- Rodar em PR e em pushes para branches principais.

### CD API (ex.: Railway/Fly.io/Render)
- Secrets do repo (deploy command/registry credenciais).
- Dockerfile `apps/api/Dockerfile` multi‑stage + `prisma generate` no runtime.

### CD Web (ex.: Vercel ou Docker + provedor)
- Secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` (quando Vercel).
- Build otimizado (Next.js standalone).

---

## 8) Release, Smoke, Canary e Rollback
- **SemVer + Changesets** (ou equivalente) para versionamento/changelog.
- **Smoke tests** pós‑deploy: `/health`, fluxo de auth, operação crítica do domínio.
- **Canary** (quando suportado) para reduzir blast radius.
- **Rollback**: plano claro (ex.: `git revert`, versão anterior de imagem, `prisma migrate resolve --rolled-back`).

---

## 9) Operação, SLO/SLI e Backups
- **SLO**: disponibilidade (ex.: 99.9%), p95 de endpoints chave, erro rate.
- **Alertas**: regras no provedor/observabilidade (latência, 5xx, falhas de webhook).
- **Backups**: política de snapshot do Postgres + restauração testada.
- **Custos**: monitorar consumo (DB, tráfego, storage).

---

## 10) Checklist de *Production Readiness* (por PR)
**Contrato/SDK**
- [ ] `openapi.yaml` sincronizado com o código; erros com **códigos estáveis**.
- [ ] `pnpm contract:sdk` atualizado.

**Qualidade/Segurança**
- [ ] DTOs com `class-validator` + `ValidationPipe` global.
- [ ] Helmet + CORS restrito + rate limit por IP/tenant.
- [ ] Logs estruturados + request-id; **@audit** em eventos críticos.
- [ ] Feature flags **ON/OFF** cobertas nos testes.
- [ ] Multi‑tenant (`TenantGuard` + `@Tenant()` + `tenantId` no Prisma).
- [ ] Webhooks (se houver) **idempotentes**.
- [ ] Sem segredos em logs; `.env` não versionado.

**Testes/CI**
- [ ] Unit + Integração + E2E passando.
- [ ] CI verde (incluindo `contract:lint` quando habilitado).

**CD**
- [ ] Pipelines de deploy apontando para ambiente correto.
- [ ] Plano de rollback documentado.

---

## 11) *Playbooks* (operacionais)
### Incidentes
1. **Detectar** (alerta/monitor).
2. **Mitigar** (throttle/flag OFF/canary/rollback).
3. **Diagnosticar** (logs + traces + métricas).
4. **Corrigir** (hotfix + PR + postmortem).

### Migrações de banco
- **Compatibilidade progressiva** (expand → migrate → contract).
- Scripts de **backfill** e *feature flags* para alternar comportamentos.
- Testar migração/rollback em staging.

---

## 12) Exemplos de Snippets (reuso)
**Feature Flag Gate**
```ts
import { getFeature } from '@core/feature-flags';
if (!getFeature('billing.enabled')) {
  throw new ForbiddenException('BILLING_DISABLED');
}
```

**Controller multi‑tenant**
```ts
@UseGuards(TenantGuard)
@Get('items')
list(@Tenant() tenantId: string) {
  return this.svc.list({ tenantId });
}
```

**Erro com código estável**
```ts
throw new ConflictException({ code: 'AUTH_EMAIL_TAKEN', message: 'E-mail já utilizado' });
```

**Log com request-id**
```ts
const rid = req.headers['x-request-id'] ?? randomUUID();
this.logger.info({ rid, route: 'GET /items', userId }, 'list items');
```

---

## 13) Matriz de Ambientes (exemplo)
| Ambiente | API | Web | DB | Flags | Observabilidade |
|---|---|---|---|---|---|
| Local | http://localhost:3001 | http://localhost:3000 | Docker Postgres | via `.env` | Console + Devtools |
| Staging | api.stg... | app.stg... | Postgres gerenciado | `FF_*` em Secrets | Logs + métricas |
| Prod | api.prod... | app.prod... | Postgres gerenciado (HA) | `FF_*` em Secrets | Logs + métricas + alertas |

---

## 14) Comandos úteis
```bash
# Dev
pnpm dev

# Testes
pnpm test
pnpm --filter api test:e2e

# Contrato + SDK
pnpm contract:sdk
pnpm contract:mock

# Prisma
pnpm prisma:dev
pnpm --filter api prisma generate
pnpm --filter api exec ts-node prisma/seed.ts

# Pipelines locais (simular CI)
pnpm -w lint && pnpm -w typecheck && pnpm -w build && pnpm -w test
```

---

## 15) Referências rápidas
- **docs/DAILY_FLOW.md** — 7 passos operacionais + prompts Copilot.
- **docs/AI_WORKFLOW.md** — DoD, checklist e governança do fluxo.
- **docs/COPILOT_PROMPTS.md** — prompts prescritivos (geração/refactor/contrato).
- **docs/EXAMPLE_MAPPING.md** — como gerar testes a partir de exemplos.
- **.github/pull_request_template.md** — checklist de PR (produção).
