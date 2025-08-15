// docs/SAAS_DEV_FLOW.md
# Fluxo de Desenvolvimento de SaaS — Copilot (VS Code) + ChatGPT

> Objetivo: reduzir tempo de ciclo mantendo padrão **API-First, TDD/BDD, multi-tenant, flags, segurança, observabilidade e CI/CD**.

---

## 0) Pré-flight (uma vez por máquina/projeto)
- **Infra local**: `docker compose -f infra/docker-compose.yml up -d`
- **.env (API)**: `apps/api/.env` com `DATABASE_URL`, `JWT_SECRET(>=32)` etc.
- **Qualidade de commit**: Husky (pre-commit: lint/typecheck/test; commit-msg: commitlint)
- **CI ligado e branch protection** (`main` exige PR + checks)

Checklist rápido:
```bash
pnpm -w lint && pnpm -w typecheck && pnpm -w build && pnpm -w test
pnpm --filter api prisma migrate status   # DB ok
```
## **1) Loop por feature (ciclo diário)**

## 1. Planejar (ChatGPT)

Entrada: objetivo de negócio, regras, exceções.
ChatGPT entrega:

- Patch do openapi.yaml (paths/schemas/status/códigos de erro)

- DTOs esperados, endpoints e Test List (unit/integration/e2e)

- Pontos de multi-tenant, flags, segurança, observabilidade

**Prompt (cole aqui comigo):**

“Feature: <descrição>. Gere trecho OpenAPI (paths+schemas+status+erros estáveis), liste DTOs e escreva a Test List (unit/integration/e2e) alinhada ao meu template (multi-tenant, flags, segurança, observabilidade).”

## 2. Contrato & SDK (terminal)
```bash
pnpm contract:sdk
# opcional para mock:
pnpm contract:mock
```
Gate de contrato: se usar, rode também contract:lint no CI.

## 3. Testes primeiro (Copilot → TDD/BDD)

Abra specs (unit/integration/e2e) nos arquivos alvo e peça ao Copilot:

**Prompt Copilot:**

    - “Crie tests primeiro (unit→integração→e2e) conforme este contrato e Test List. Use class-validator nos DTOs, ValidationPipe global, erros com códigos estáveis e cubra flags ON/OFF e x-tenant-id.”

**Comandos:**
```bash
pnpm test
pnpm --filter api test:e2e
```
## 4. Implementação (Copilot → controllers/services/DTOs)

Abra controller/service/DTO e peça ao Copilot a camada API:

**Prompt Copilot (API-First):**

   - “Gerar controller/service/DTOs em apps/api/src/<dominio>/ conforme openapi.yaml. Imports absolutos (@core/...). argon2 para senha; JWT (access 15m/refresh 7d com rotação); TenantGuard + @Tenant(); Prisma com where: { tenantId }; getFeature('<dominio>.<flag>') (OFF ⇒ 403 ..._DISABLED); logs estruturados com request-id e evento @audit nos pontos críticos.”

## 5. Banco & seed
```bash
pnpm test
pnpm --filter api test:e2e
```

## 6. Testar local (tem que ficar verde)
```bash
pnpm test
pnpm --filter api test:e2e
```
Verifique ramos de flag ON/OFF e filtros por tenantId.

## 7. Revisão (ChatGPT)

**Cole diffs/trechos críticos aqui comigo. Eu reviso:**

- Aderência a openapi.yaml, DTO/ValidationPipe
- Multi-tenant (guard+decorator+filtro Prisma)
- Flags (gates e testes ON/OFF)
- Segurança (argon2, JWT, Helmet/CORS/rate limit)
- Observabilidade (logs estruturados + @audit)
- Testes (unit/integration/e2e)

**Prompt (cole aqui comigo):**

- “Eis os diffs/trechos. Audite TDD/BDD, multi-tenant, flags, segurança, observabilidade e contrato→código. Liste ajustes concretos.”

## 8. PR + CI/CD

- Preencha o .github/pull_request_template.md
- CI deve rodar: lint → typecheck → build → test (+ contract:sdk/contract:lint quando aplicável)
- Branch protection: exigir PR e checks verdes
- Merge ⇒ dispara CD (API/Web)

## 9. Pós-deploy (rápido)

- Smoke: /health, auth login, operação crítica do domínio
- Observabilidade: checar logs/alertas; evento @audit registrado
- Se necessário, rollback (imagem anterior/migração resolvida)

## **2) Quem faz o quê (RACI)**

Atividade	                                        Dev	    Copilot	        ChatGPT	        CI/CD

Especificar feature & regras	                    R		                 A/C	
OpenAPI + Test List	                                C		                  R	
Gerar tests (unit/integration/e2e)	                R	       A	          C	
Implementar controller/service/DTOs	                R	       A	          C	
Multi-tenant/Flags/Segurança/Observabilidade	    R	       A	          C	
Rodar testes locais	                                R			
Revisão técnica	                                    R		                  A	
PR + Checklist + Merge	                            R		                  C	             A
Deploy + Smoke	                                    R			                             A

R = Responsible, A = Accountable, C = Consulted.

## 3) Portas de saída (gates) por etapa

- Planejar → OpenAPI + Test List aprovados por ChatGPT
- TDD → testes gerados, cobrindo flags e tenant
- Implementar → DTO com class-validator, TenantGuard/@Tenant(), getFeature(), códigos de erro estáveis
- Testar → pnpm test e pnpm --filter api test:e2e verdes
- PR → checklist completo e CI verde
- Pós-deploy → smoke ok + logs/audit ok

## 4) Prompts Prontos (cola direto)

**Copilot — API-First**

   -  “Monorepo SaaS. Gerar controller/service/DTOs conforme openapi.yaml em apps/api/src/<dominio>/. TS estrito; DTO class-validator; ValidationPipe. argon2; JWT (15m/7d); erros com códigos estáveis; TenantGuard + @Tenant() e Prisma where: { tenantId }; getFeature('<dominio>.<flag>') OFF ⇒ 403 ..._DISABLED); @core/logger com request-id; @audit no evento crítico. Crie também tests unit/integration/e2e.”

**Copilot — Multi-tenant**

   - “Adicionar @UseGuards(TenantGuard) + @Tenant() e filtrar todas queries Prisma com tenantId. Criar e2e com x-tenant-id.”

**Copilot — Flags**

   - “Aplicar getFeature('billing.enabled'); OFF ⇒ 403 BILLING_DISABLED. Gerar testes ON/OFF (unit e e2e).”

**Copilot — Observabilidade/Audit**

   - “Adicionar logs com request-id no controller e registrar @audit { action, userId, orgId } no service. Criar teste validando chamada de audit.”

**ChatGPT — Planejamento**

   - “Gerar patch OpenAPI + Test List (unit/integration/e2e) + notas de multi-tenant/flags/segurança/observabilidade.”

**ChatGPT — Revisão**

   - “Auditar diffs: contrato↔código, DTO/validations, multi-tenant, flags, segurança, observabilidade, testes. Devolver checklist de correções.”

## 5) Anti-padrões a evitar

- ndpoint multi-tenant sem TenantGuard/@Tenant() ou sem where: { tenantId }
- ensagens de erro “livres” (sem códigos estáveis)
- crypt/md5 (padrão é argon2)
- ota premium sem getFeature(...)
- ogar segredos/tokens
- R sem testes ou sem contract:sdk quando alterou contrato

## 6) Métricas úteis (time/qualidade)

- Lead time por feature (planejar→deploy)
- Pass rate de testes (unit/integration/e2e)
- Drift de contrato (falhas em contract:lint)
- Incidentes pós-deploy e tempo de rollback

## 7) Comandos essenciais
```bash
# Contrato + SDK
pnpm contract:sdk
pnpm contract:mock   # opcional

# Testes
pnpm test
pnpm --filter api test:e2e

# DB
docker compose -f infra/docker-compose.yml up -d
pnpm prisma:dev
pnpm --filter api prisma generate
pnpm --filter api exec ts-node prisma/seed.ts

# Pipeline local (simular CI)
pnpm -w lint && pnpm -w typecheck && pnpm -w build && pnpm -w test
```
```yaml
# Contrato + SDK
pnpm contract:sdk
pnpm contract:mock   # opcional

# Testes
pnpm test
pnpm --filter api test:e2e

# DB
docker compose -f infra/docker-compose.yml up -d
pnpm prisma:dev
pnpm --filter api prisma generate
pnpm --filter api exec ts-node prisma/seed.ts

# Pipeline local (simular CI)
pnpm -w lint && pnpm -w typecheck && pnpm -w build && pnpm -w test
```

**Notas** 

- Este fluxo “amarra” o que já criamos (DAILY_FLOW, AI_WORKFLOW, Playbook) num único how-to operacional.

- Se quiser, eu integro referências cruzadas entre os docs (links no README) e adiciono um script pnpm doctor para validar gates (husky/commitlint/env/ci) com um comando só. Quer que eu já inclua também?