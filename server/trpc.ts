import { initTRPC } from '@trpc/server';
import { ZodError } from 'zod';

// Initialize tRPC
// This is the file you would import on the server to create new procedures.
export const t = initTRPC.create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.code === 'BAD_REQUEST' && error.cause instanceof ZodError
            ? error.cause.flatten()
            : null,
      },
    };
  },
});

// Create a server-side router
// This is where you would combine your different API routes.
export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
