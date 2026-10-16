import type { E2EConfig } from 'e2e';
import { web } from '@e2e-dev/web';

export default {
  targets: [
    {
      name: 'root',
      engine: web(),
      app: {
        url: process.env.ROOT_URL ?? 'http://localhost:3000',
      },
    },
    {
      name: 'support',
      engine: web(),
      app: {
        url: process.env.SUPPORT_URL ?? 'http://localhost:3003',
      },
    },
    {
      name: 'internal',
      engine: web(),
      app: {
        url: process.env.INTERNAL_URL ?? 'http://localhost:3002',
      },
    },
    {
      name: 'webapp',
      engine: web(),
      app: {
        url: process.env.APP_URL ?? 'http://localhost:3001',
      },
    },
  ],
} satisfies E2EConfig;
