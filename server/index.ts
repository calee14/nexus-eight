import { createTRPCRouter, publicProcedure } from './trpc';
import { z } from 'zod';
import { retireNexus4, retireNexus6, retireNexus8, retireNexus9 } from '../util/retire';

const tickers = ['CRWD', 'APP', 'DDOG', 'GOOGL', 'META', 'AMZN', 'TTD'];

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
    .query(async () => {
      // return result as all async scraper funcs
      const allTickerData = await Promise.all(
        tickers.map(async (ticker) => {
          const [peg, growth, fcf, ps] = await Promise.all([
            retireNexus8(ticker),
            retireNexus6(ticker),
            retireNexus9(ticker),
            retireNexus4(ticker)
          ]);
          return { ticker: ticker, peg: peg, growth: growth, fcf: fcf, ps: ps };
        })
      );
      return allTickerData;
    }),

  addTicker: publicProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      if (tickers.indexOf(input) !== -1) {
        return false;
      }
      tickers.push(input);
      return true;
    }),

  removeTicker: publicProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      if (tickers.indexOf(input) === -1) {
        return false;
      }
      tickers.splice(tickers.indexOf(input), 1);
      return true;
    }),

  getTickerData: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const [peg, growth, fcf, ps] = await Promise.all([
        retireNexus8(input),
        retireNexus6(input),
        retireNexus9(input),
        retireNexus4(input)
      ]);
      return { ticker: input, peg: peg, growth: growth, fcf: fcf, ps: ps };

    })
});

export type AppRouter = typeof appRouter;
