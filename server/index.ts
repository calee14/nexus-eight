import { createTRPCRouter, publicProcedure } from './trpc';
import { z } from 'zod';
import { retireNexus4, retireNexus6, retireNexus8, retireNexus9 } from '../util/retire';

const tickers = ['CRWD', 'APP', 'DDOG', 'GOOGL', 'META', 'AMZN'];

// main router
export const appRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello, ${input.text}`,
      };
    }),
  getTickers: publicProcedure
    .query(async () => {
      // Use Promise.all() to concurrently fetch data for each ticker
      // The `async` keyword on the outer function is crucial.
      const allTickerData = await Promise.all(
        tickers.map(async (ticker) => {
          // Use Promise.all() again to concurrently fetch the four data points for each ticker
          const [peg, growth, fcf, ps] = await Promise.all([
            retireNexus8(ticker),
            retireNexus6(ticker),
            retireNexus9(ticker),
            retireNexus4(ticker)
          ]);
          return { ticker: ticker, peg: peg, growth: growth, fcf: fcf, ps: ps };
        })
      );
      // Return the fully resolved array of data
      return allTickerData;
    }),
});

export type AppRouter = typeof appRouter;
