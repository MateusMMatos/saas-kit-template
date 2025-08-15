import { z } from 'zod';
export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(16),
  PORT: z.coerce.number().default(3001)
});
export function parseEnv(raw: NodeJS.ProcessEnv) {
  const parsed = envSchema.safeParse(raw);
  if (!parsed.success) {
    console.error('Invalid environment', parsed.error.flatten().fieldErrors);
    process.exit(1);
  }
  return parsed.data;
}
