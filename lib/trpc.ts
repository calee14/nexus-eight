import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../server';

// Create a dynamic URL based on the environment
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return ''; // On the client, use a relative path
  }
  // On the server, use an environment variable
  return process.env.NEXT_PUBLIC_VERCEL_URL || `http://localhost:${process.env.PORT ?? 3000}`;
};

// Pass AppRouter as a generic here.
export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`,
    }),
  ],
});
