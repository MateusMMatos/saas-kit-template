
```md
// docs/EXAMPLE_MAPPING.md
# Example Mapping → Testes

> Converta exemplos de negócio (cartões: Regras, Perguntas, Exemplos) em **testes**.

## História
Como <persona>, eu quero <capacidade> para <resultado>.

## Regras (Amarelos)
- R1: E‑mail deve ser único.
- R2: Senha mínima de 8 chars.
- R3: Se `billing.enabled` estiver **false**, negar acesso a rotas premium (403 `BILLING_DISABLED`).

## Perguntas (Vermelhos)
- Q1: O que acontece se o provedor externo falhar? (ex.: Stripe 5xx)
- Q2: Como tratar idempotência de webhooks?

## Exemplos (Azuis) → Given/When/Then → **Testes**
1. **Given** payload válido **When** POST /auth/register **Then** 201 + tokens
2. **Given** e‑mail já usado **When** POST /auth/register **Then** 409 `AUTH_EMAIL_TAKEN`
3. **Given** flag `billing.enabled=false` **When** POST /billing/checkout **Then** 403 `BILLING_DISABLED`
4. **Given** webhook repetido **When** POST /billing/webhooks/stripe **Then** 200 `{ duplicate: true }`

## Saída Esperada (Test List)
- Unit: validações de DTO, geração de tokens, gate de flag.
- Integração: controller aplica `ValidationPipe`, mapeia erros e status.
- E2E: fluxo completo, `x-tenant-id`, flags ON/OFF, idempotência.
