import { createTRPCRouter, publicProcedure } from './trpc';
import { z } from 'zod';
import { fetchCachedTickerData } from '@/lib/fetchCachedTickerData';


// main router
export const appRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello, ${input.text}`,
      };
    }),

  getAllTickerData: publicProcedure
    .input(z.object({ refresh: z.boolean().default(false) }))
    .query(async ({ ctx, input }) => {
      if (!(await ctx.redis.exists('tickers:set'))) {
        return [];
      }
      const tickers = await ctx.redis.sMembers('tickers:set');

      // collect all data for each ticker from async scraper funcs
      const allTickerData = await Promise.all(
        tickers.map(async (ticker) => {
          try {
            const tickerData = await fetchCachedTickerData(ticker, ctx.redis, input.refresh);
            if (tickerData) {
              return tickerData;
            } else {
              return {};
            }
          } catch (error) {
            console.error('error when fetching all cached data', error);
            return {}
          }
        })
      );

      if (input.refresh) {
        // update last updated time
        const currTime = new Date().toISOString();
        ctx.redis.set('cache:ticker:updatedate', currTime);
      }
      return allTickerData;
    }),

  addTicker: publicProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      if (await ctx.redis.sIsMember('tickers:set', input)) {
        return false;
      }
      const status = await ctx.redis.sAdd('tickers:set', input);
      return status !== -1;
    }),

  removeTicker: publicProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      const status = await ctx.redis.sRem('tickers:set', input);
      return status;
    }),

  getTickerData: publicProcedure
    .input(z.object({ ticker: z.string(), refresh: z.boolean().default(false) }))
    .query(async ({ ctx, input }) => {
      return await fetchCachedTickerData(input.ticker, ctx.redis, input.refresh);
    }),
  getLastUpdated: publicProcedure
    .query(async ({ ctx }) => {
      return await ctx.redis.get('cache:ticker:updatedate');
    })
});

export type AppRouter = typeof appRouter;
