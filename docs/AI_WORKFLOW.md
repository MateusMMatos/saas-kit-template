// docs/AI_WORKFLOW.md
# Fluxo Híbrido — Copilot + ChatGPT (Template SaaS)

> Objetivo: acelerar features seguindo **API‑First + TDD/BDD**, evitando desvios do padrão do monorepo.

## 0) Definição de Pronto (DoD)
- **Contrato** OpenAPI atualizado (paths/schemas, status codes, exemplos, **erros com códigos estáveis**).
- **Testes**: unit (regras/domínio), integração (controllers/DTO), e2e (fluxo real).
- **Multi-tenant** aplicado quando aplicável (`TenantGuard` + `@Tenant()` + `where: { tenantId }` no Prisma).
- **Feature Flags** com `getFeature('dominio.flag')`, cobrindo ON/OFF nos testes.
- **Segurança**: argon2; JWT access 15m / refresh 7d (rotação); Helmet; CORS restrito; rate limit por IP/tenant.
- **Observabilidade**: logs estruturados com `request-id` + evento **@audit** quando crítico.
- **CI verde** (lint, typecheck, build, test) + (se alterou contrato) `pnpm contract:sdk`.

## 1) Planejar (ChatGPT)
- Descrever a feature em linguagem de negócio (objetivo, regras, exceções, SLAs, NFRs).
- Receber do ChatGPT:
  - Trecho do `openapi.yaml` (paths/schemas).
  - **Test List** (unit/integration/e2e) derivada de Example Mapping (Given/When/Then).
  - Checklist: multi‑tenant/flags/segurança/observabilidade.

## 2) Contrato + SDK
```bash
pnpm contract:sdk
# opcional:
pnpm contract:mock
```

## 3) TDD/BDD (comece pelos testes)
- Criar specs unit (regras), depois integração (DTO/controller), por fim e2e (fluxo).
- Cobrir: happy path, validações, erros de provedor, idempotência (se webhooks) e flags ON/OFF.

## 4) Implementação (Copilot no VS Code)
- Gerar controller/service/DTOs a partir do contrato.
- Multi-tenant: `@UseGuards(TenantGuard)` + `@Tenant()`; Prisma sempre com `tenantId`.
- Flags: `getFeature('<dominio>.<flag>')` com gate (403 + código estável quando OFF).
- Segurança e logs conforme padrão do template.

## 5) Banco + Seed
```bash
docker compose -f infra/docker-compose.yml up -d
pnpm prisma:dev
pnpm --filter api prisma generate
pnpm --filter api exec ts-node prisma/seed.ts
```
## 6) Testes
```bash
pnpm test
pnpm --filter api test:e2e
```

## 7) Revisão (ChatGPT)

- Colar diffs/trechos críticos para revisão contra: TDD/BDD, multi‑tenant, flags, segurança, observabilidade.

## 8) PR + CI/CD

- Abrir PR com checklist preenchido (abaixo).
- CI verde → merge para main dispara CD (API/Web).

---

## Checklist rápido por PR

 - openapi.yaml atualizado; status codes e códigos de erro estáveis (ex.: AUTH_EMAIL_TAKEN).

 - DTOs com class-validator; ValidationPipe global considerado.

 - Multi-tenant aplicado (TenantGuard + @Tenant() + filtros Prisma por tenant).

 - Feature flags (getFeature(...)) com testes ON/OFF.

 - Segurança (argon2, JWT 15m/7d, Helmet, CORS restrito, rate limit).

 - Observabilidade (logs estruturados + request-id; evento @audit se crítico).

 - Testes: unit + integração + e2e cobrindo regras, validações e fluxos reais.

 - CI verde; se alterou contrato → pnpm contract:sdk rodado/validado.

---

## comandos
```bash
# Contrato + SDK
pnpm contract:sdk
pnpm contract:mock   # opcional

# Testes
pnpm test
pnpm --filter api test:e2e

```
---

## Notas

## Decisões

- Tornamos o Copilot mais “prescritivo” com Anti-padrões e Pitfalls para ancorar saída (DTOs, status codes, erros estáveis).

- Example Mapping → Test List força TDD/BDD na prática e se conecta aos prompts.

- PR Template garante revisão consistente (multi-tenant, flags, segurança, observabilidade).

- .vscode/settings.json ativa sugestões de teste primeiro e reforça lint/format.

## Suposições

- ValidationPipe global já habilitado no main.ts.

- getFeature exposto em @core/feature-flags.

- TenantGuard e @Tenant() disponíveis conforme seu template.

- JWT (15m/7d) e argon2 já presentes nos módulos de referência.

## Envs/Flags úteis

- FF_BILLING_ENABLED=true|false

- FF_AUTH_MFA=true|false

- JWT_SECRET, DATABASE_URL (já previstos no README/CHECKLIST)

---

## 📦 Commits para novos docs e ajustes de workflow

Quando adicionar ou atualizar este fluxo, use o padrão **Conventional Commits** com `scope` **workflow** ou **docs**:

Exemplo:
```bash
git add .
git commit -m "docs(workflow): adicionar fluxos híbridos Copilot + ChatGPT e prompts padrão
```
Adiciona:
- docs/AI_WORKFLOW.md — fluxo híbrido detalhado para API-First + TDD/BDD
- docs/COPILOT_PROMPTS.md — prompts padrão para Copilot Chat (VS Code)
- docs/FEATURE_TEMPLATE.md — template para ticket de feature com Example Mapping
- docs/EXAMPLE_MAPPING.md — exemplo preenchido de mapeamento para testes
- .vscode/settings.json — ajustes para lint, imports absolutos e Copilot priorizando testes
- .github/pull_request_template.md — checklist de PR com foco em multi-tenant, flags, segurança e observabilidade
"
    💡 Dica: O corpo do commit deve listar claramente os arquivos tocados e o motivo da mudança. Isso mantém histórico limpo e ajuda revisores.