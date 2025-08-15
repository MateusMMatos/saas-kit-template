// packages/core/src/feature-flags.ts
type Flags = Record<string, boolean>;

const defaults: Flags = {
  'auth.mfa': false,
  'billing.enabled': false,
  'reports.advanced': false,
};

const overrides: Flags = {};
const memo = new Map<string, boolean>();

export function setFeature(flag: string, value: boolean) {
  overrides[flag] = value;
  memo.delete(flag); // invalida cache
}

export function getFeature(flag: string): boolean {
  if (memo.has(flag)) return memo.get(flag)!;

  if (flag in overrides) {
    memo.set(flag, overrides[flag]);
    return overrides[flag];
  }

  const envKey = 'FF_' + flag.replace(/[.]/g, '_').toUpperCase();
  const raw = process.env[envKey];
  const val =
    !!raw && (raw === '1' || raw.toLowerCase() === 'true');

  const finalVal = val ?? (defaults[flag] ?? false);
  memo.set(flag, finalVal);
  return finalVal;
}

// opcional: limpar cache (ex.: em testes)
export function resetFeatures() {
  for (const k of Object.keys(overrides)) delete overrides[k];
  memo.clear();
}
