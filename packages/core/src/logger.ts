import pino from 'pino';
export const logger = pino({ name: 'saas-kit', level: process.env.LOG_LEVEL || 'info' });
