# Context Snapshot
_Resumo gerado automaticamente para iniciar conversas novas com contexto do repo._

> Atualize este arquivo rodando `pnpm snapshot:context` ou via GitHub Actions.

## Convenções & Padrões (links úteis)
- docs/SAAS_DEV_FLOW.md — fluxo dev (Copilot + ChatGPT)
- docs/AI_WORKFLOW.md — API-First + TDD/BDD + DoD
- docs/DAILY_FLOW.md — 7 passos operacionais
- docs/COPILOT_PROMPTS.md — prompts prontos
- docs/PRODUCAO_SAAS_PLAYBOOK.md — playbook de produção


## Endpoints (OpenAPI)
Total: 2

- `POST /auth/login` — Login por email/senha
- `POST /auth/register` — Registra usuário por email/senha

## Domínios (API)
- admin
- audit
- auth
- billing
- files
- notifications
- projects
- tenant

**Controllers** (6): apps/api/src/health.controller.ts, apps/api/src/projects/projects.controller.ts, apps/api/src/billing/webhook.controller.ts, apps/api/src/billing/billing.controller.ts, apps/api/src/auth/auth.controller.ts, apps/api/src/admin/admin.controller.ts

**Services** (5): apps/api/src/notifications/notifications.service.ts, apps/api/src/files/files.service.ts, apps/api/src/billing/webhook.service.ts, apps/api/src/billing/billing.service.ts, apps/api/src/auth/auth.service.ts


## Multi-tenant (ocorrências de guard/decorator)
- apps/api/src/projects/projects.controller.ts


## Feature Flags (encontradas)
- packages/core/src/feature-flags.ts: (nenhuma encontrada)


## Testes
- Unit/Integração (API): 3
- E2E (API): 2


## Últimos commits
f463a3a docs(context): add context snapshot
d93f409 docs(context): atualizar CONTEXT_SNAPSHOT.md
dee213d docs(context): adicionar snapshot automático de contexto
7db72ee chore(infra): initial template
af276ab chore(infra): testar hooks
0fd3154 chore(repo): ok
454f2a1 wip
c66c8ac feat: add initial README and project checklist
84622a7 Initial commit


## Próximos passos (edite livremente)
- [ ] Feature atual: <descreva>
- [ ] Contrato atualizado em `openapi.yaml`
- [ ] Testes (unit/integration/e2e) gerados
- [ ] Implementação em `apps/api/src/<dominio>/`
- [ ] CI verde + PR
