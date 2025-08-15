// .github/pull_request_template.md
## Resumo
Descreva a mudança e o problema que resolve.

## Checklist
- [ ] `openapi.yaml` atualizado e coerente com o código (paths, schemas, exemplos, status)
- [ ] DTOs com `class-validator` e `ValidationPipe` global considerado
- [ ] **Multi-tenant** (TenantGuard + @Tenant() + `tenantId` no Prisma)
- [ ] **Feature flags** (`getFeature`) com testes ON/OFF
- [ ] **Segurança** (argon2, JWT 15m/7d, Helmet/CORS/rate limit)
- [ ] **Observabilidade** (logs + request-id; evento @audit se crítico)
- [ ] **Testes**: unit + integração + e2e passando; cobrindo erros com códigos estáveis
- [ ] **CI verde**; se alterou contrato → `pnpm contract:sdk`

## Evidências
- Prints dos testes/CI, exemplos de requests/responses, logs/audit relevantes.

## Notas de Deploy
- Migrações/rollback, flags/SECRETS adicionados, verificação pós‑deploy.
