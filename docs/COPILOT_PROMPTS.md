```md
// docs/COPILOT_PROMPTS.md
# Prompts para Copilot Chat (VS Code)

> Dica: **abra no editor** os arquivos relevantes (controller, service, DTO, spec, schema.prisma, openapi.yaml). O Copilot usa o contexto aberto.

---

## 1) Gerar camada da API a partir do contrato (API‑First)
Você está no monorepo SaaS. Use **TypeScript estrito**, DTOs com **class-validator**, `ValidationPipe` global.
Contrato atualizado no `openapi.yaml` com: <DESCREVER ENDPOINTS>.
Crie **controller/service/DTOs** em `apps/api/src/<dominio>/` com imports absolutos (`@core/...`).
Regras:
- Senha com **argon2**.
- **JWT**: access 15m, refresh 7d (com rotação).
- Erros com **códigos estáveis** (ex.: `AUTH_EMAIL_TAKEN`, `AUTH_INVALID_CREDENTIALS`).
- Multi‑tenant (quando aplicável): `@UseGuards(TenantGuard)` + `@Tenant()` e **`tenantId` nas queries Prisma**.
- Feature flags via `getFeature('<dominio>.<flag>')` — se OFF, retornar **403** + código `..._DISABLED`.

Crie também testes:
- **Unit (service)**: regras/erros.
- **Integração (controller)**: validações de DTO e status codes.
- **E2E (fluxo)**: cenário completo feliz + inválidos.

---

## 2) Tornar endpoint multi‑tenant
Edite `apps/api/src/<dominio>/*` para:
- Adicionar `@UseGuards(TenantGuard)` no controller e o decorator `@Tenant()` no handler.
- Inserir `tenantId` em **todas** as consultas Prisma (`where: { tenantId }`).
- Criar e2e enviando `x-tenant-id` e **validando o filtro por tenant**.

---

## 3) Feature flags (gate)
Proteja rotas com `getFeature('billing.enabled')`. Se `false`:
- Responder `403` com `BILLING_DISABLED`.
- Criar **testes unit e e2e** cobrindo ambos os caminhos (ON/OFF).

---

## 4) Observabilidade/Auditoria
Use `@core/logger` no controller (inclua `request-id` nos logs).
Registre evento crítico via `@audit` no service com `{ action, userId, orgId }`.
Teste (unit/integração): verifique que o audit foi chamado com o **payload esperado**.

---

## 5) Segurança (endurecer AppModule se faltar)
Garantir **Helmet**, **CORS restrito** e **rate limit por IP/tenant**.
Teste: `GET /health` deve conter headers de segurança básicos.

---

## 6) Web + SDK (Next.js App Router)
Crie `app/(auth)/login/page.tsx` usando `packages/api-client`.
Implemente uma **server action** de login; comente como salvar o **access token** em cookie **httpOnly** (se o boilerplate não tiver).
Crie **teste de componente** com React Testing Library.

---

## 7) Refactor seguro (com salvaguarda de comportamento)
Refatore o service para isolar Prisma num **repositório** e reduzir acoplamento.
Antes, gere testes que cubram o comportamento atual (**golden tests**).
Depois, aplique a refatoração **mantendo a tipagem estrita**.

---

## 8) Contrato ↔ Código (diferenças)
Compare `openapi.yaml` com DTOs/controllers/erros. Liste **divergências** de nomes/validações/status codes e gere um **patch** corrigindo.

---

## Anti‑padrões (não faça)
- Acessar dados sem `tenantId` em domínios multi‑tenant.
- Retornar mensagens de erro “livres”; **use códigos estáveis**.
- Usar `bcrypt`/`md5` para senha (padrão é **argon2**).
- Ignorar flags: toda rota premium deve checar `getFeature(...)`.
- Logar segredos/tokens; logs devem ser estruturados e sem segredos.

## Pitfalls comuns e como evitar
- **Status codes**: alinhar com o contrato (201 em criação; 200 em leitura).
- **DTOs**: sempre com `class-validator`; validar e‑mail e tamanhos mínimos.
- **JWT**: expirações corretas (15m/7d) e **rotação** no refresh.
- **Tests**: cobrir **ON/OFF** de feature flags e `x-tenant-id`.
