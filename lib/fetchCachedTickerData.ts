// lib/fetchCachedTickerData.ts
import { retireNexus3, retireNexus4, retireNexus6, retireNexus8, retireNexus9 } from "@/lib/retire";
import { redis } from "./redis";

type RedisType = typeof redis;

export async function fetchCachedTickerData(ticker: string, redis: RedisType, refresh: boolean) {
  const cacheKey = `cache:ticker:${ticker}`;
  const cacheExpiration = 17 * 60 * 60;

  if (!refresh) {
    // check cache for ticker data
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      try {
        return JSON.parse(cachedData);
      } catch {
        console.error('Error parsing cached ticker data: ', ticker);
      }
    }
  }
  // scrape all relevant stock attr
  const [peg, growth, fcf, pe, ps] = await Promise.all([
    retireNexus8(ticker),
    retireNexus6(ticker),
    retireNexus9(ticker),
    retireNexus3(ticker),
    retireNexus4(ticker)
  ]);
  const tickerData = { ticker: ticker, peg: peg, growth: growth, fcf: fcf, pe: pe, ps: ps };
  try {
    await redis.setEx(cacheKey, cacheExpiration, JSON.stringify(tickerData));
  } catch (error) {
    console.error('Error caching ticker data', error);
  }
  return tickerData;
}
