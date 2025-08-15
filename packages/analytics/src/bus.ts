export type Event = { name: string; ts?: string; payload?: any; tenantId?: string; userId?: string };
export type Handler = (e: Event) => Promise<void> | void;
const handlers: Record<string, Handler[]> = {};
export function on(name: string, h: Handler) { (handlers[name] ||= []).push(h); }
export async function emit(e: Event) { for (const h of handlers[e.name] || []) await h(e); }
