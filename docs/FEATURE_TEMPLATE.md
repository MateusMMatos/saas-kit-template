// docs/FEATURE_TEMPLATE.md
# Ticket de Feature (API‑First)

## 1) Objetivo de negócio
- Resultado esperado:
- Métricas de sucesso (ex.: ativação, MAU, conversão, p95):

## 2) Contrato OpenAPI (trecho a anexar em `openapi.yaml`)
```yaml
# paths + schemas completos (inclua status codes, exemplos e códigos de erro)
```
## 3) Regras & Exceções (BDD)
- Regra 1:
- Regra 2:
- Exceção 1:
- **Códigos de erro estáveis**: (liste todos, ex.: `AUTH_EMAIL_TAKEN`, `BILLING_DISABLED`)

Cenários (Given/When/Then)

Given <contexto> When <ação> Then <resultado observável>

Given … When … Then …

## 4) Test List (TDD)

Unit

- Happy path da regra
- Validações (DTO inválido)
- Erros de provedor/infra (quando houver)
- Idempotência (webhooks)

Integração

- Controller valida DTO
- Status codes e códigos de erro

E2E

- Fluxo completo
- Multi‑tenant (x-tenant-id; filtro por tenantId)
- Feature flag habilitada/desabilitada

## 5) Observabilidade / Segurança

- Logs estruturados + request-id
- Audit de ação crítica com { action, userId, orgId }
- Helmet, CORS restrito, rate limit por IP/tenant
- Senhas argon2; JWT access 15m + refresh 7d

## 6) Flags / Envs

- FF_<DOMINIO>_<FLAG>=true|false (e.g., FF_BILLING_ENABLED=true)
- Outras envs necessárias (listar nome e descrição)

## 7) Plano de Deploy

- Migrações Prisma (rollback incluído)
- Backfill/seed (se aplicável)
- Riscos e rollback
- Dependências externas (webhooks/keys) e validações pós‑deploy