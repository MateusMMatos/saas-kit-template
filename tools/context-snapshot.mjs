// tools/context-snapshot.mjs
// Node 18+ | pnpm -w add -D yaml glob
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import yaml from 'yaml';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const read = (p) => fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null;
const write = (p, c) => fs.mkdirSync(path.dirname(p), { recursive: true }) || fs.writeFileSync(p, c);

const out = [];
const p = (...xs) => path.join(ROOT, ...xs);

// 1) Convenções (referências rápidas)
out.push(`# Context Snapshot
_Resumo gerado automaticamente para iniciar conversas novas com contexto do repo._

> Atualize este arquivo rodando \`pnpm snapshot:context\` ou via GitHub Actions.

## Convenções & Padrões (links úteis)
- docs/SAAS_DEV_FLOW.md — fluxo dev (Copilot + ChatGPT)
- docs/AI_WORKFLOW.md — API-First + TDD/BDD + DoD
- docs/DAILY_FLOW.md — 7 passos operacionais
- docs/COPILOT_PROMPTS.md — prompts prontos
- docs/PRODUCAO_SAAS_PLAYBOOK.md — playbook de produção
`);

// 2) OpenAPI (listar operações)
const openapiPath = p('openapi.yaml');
const yml = read(openapiPath);
if (yml) {
  try {
    const doc = yaml.parse(yml);
    const paths = doc?.paths || {};
    const items = [];
    for (const [route, def] of Object.entries(paths)) {
      for (const method of Object.keys(def)) {
        const info = def[method] || {};
        items.push({ method: method.toUpperCase(), route, summary: info.summary || '' });
      }
    }
    items.sort((a,b)=> (a.route+a.method).localeCompare(b.route+b.method));
    const MAX = 120; // evita snapshot gigante
    out.push(`\n## Endpoints (OpenAPI)\nTotal: ${items.length}\n`);
    out.push(items.slice(0, MAX).map(i => `- \`${i.method} ${i.route}\`${i.summary ? ` — ${i.summary}` : ''}`).join('\n') || '_sem paths_');
    if (items.length > MAX) out.push(`\n_(+${items.length-MAX} endpoints ocultados para manter o snapshot leve)_`);
  } catch (e) {
    out.push(`\n## Endpoints (OpenAPI)\nFalha ao parsear \`openapi.yaml\`: ${e.message}`);
  }
} else {
  out.push(`\n## Endpoints (OpenAPI)\n\`openapi.yaml\` não encontrado.`);
}

// 3) Domínios/arquitetura API
const apiSrc = p('apps','api','src');
if (fs.existsSync(apiSrc)) {
  const domains = fs.readdirSync(apiSrc).filter(d => fs.statSync(path.join(apiSrc,d)).isDirectory());
  out.push(`\n## Domínios (API)\n${domains.map(d => `- ${d}`).join('\n') || '_sem domínios_'}\n`);
  const controllers = glob.sync('apps/api/src/**/*.controller.ts', { cwd: ROOT });
  const services = glob.sync('apps/api/src/**/*.service.ts', { cwd: ROOT });
  out.push(`**Controllers** (${controllers.length}): ${controllers.slice(0,30).join(', ')}${controllers.length>30?' …':''}`);
  out.push(`\n**Services** (${services.length}): ${services.slice(0,30).join(', ')}${services.length>30?' …':''}\n`);
}

// 4) Multi-tenant (checagem rápida por decoradores/guard)
const mtFiles = glob.sync('apps/api/src/**/*.{ts,tsx}', { cwd: ROOT })
  .filter(f => {
    const c = read(p(f));
    return c && (c.includes('@UseGuards(TenantGuard)') || c.includes('@Tenant(') || c.includes('@Tenant()'));
  });
out.push(`\n## Multi-tenant (ocorrências de guard/decorator)\n${mtFiles.length ? mtFiles.map(f=>`- ${f}`).join('\n') : '_nenhuma ocorrência encontrada_'}\n`);

// 5) Feature Flags (tentativas de leitura)
let flags = [];
const coreFlags = p('packages','core','src','feature-flags.ts');
const envApi = p('apps','api','.env');
const envRoot = p('.env');

const scanFlags = (src, label) => {
  const content = read(src);
  if (!content) return;
  const ff = Array.from(content.matchAll(/FF_[A-Z0-9_]+/g)).map(m=>m[0]);
  flags.push({ label, ff: [...new Set(ff)] });
};
scanFlags(coreFlags, 'packages/core/src/feature-flags.ts');
scanFlags(envApi, 'apps/api/.env');
scanFlags(envRoot, '.env (root)');

out.push(`\n## Feature Flags (encontradas)\n${
  flags.length ? flags.map(f=>`- ${f.label}: ${f.ff.length?f.ff.join(', '):'(nenhuma encontrada)'}`).join('\n') : '_nenhum arquivo de flags encontrado_'
}\n`);

// 6) Testes (contagem)
const unitSpecs = glob.sync('apps/api/src/**/*.spec.ts', { cwd: ROOT });
const e2eSpecs  = glob.sync('apps/api/test/**/*.e2e-spec.ts', { cwd: ROOT });
out.push(`\n## Testes\n- Unit/Integração (API): ${unitSpecs.length}\n- E2E (API): ${e2eSpecs.length}\n`);

// 7) Últimos commits (para alinhar contexto)
let commits = '';
try {
  commits = execSync('git log --pretty=format:"%h %s" -n 15', { cwd: ROOT }).toString();
} catch {}
out.push(`\n## Últimos commits\n${commits || '_git log indisponível_'}\n`);

// 8) Próximos passos (bloco editável)
out.push(`\n## Próximos passos (edite livremente)\n- [ ] Feature atual: <descreva>\n- [ ] Contrato atualizado em \`openapi.yaml\`\n- [ ] Testes (unit/integration/e2e) gerados\n- [ ] Implementação em \`apps/api/src/<dominio>/\`\n- [ ] CI verde + PR\n`);

write(p('docs','CONTEXT_SNAPSHOT.md'), out.join('\n'));
console.log('✅ docs/CONTEXT_SNAPSHOT.md atualizado.');
