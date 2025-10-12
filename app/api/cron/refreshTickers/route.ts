// app/api/cron/refreshTickers/route.ts
import { NextRequest } from 'next/server';
import { connectRedis, redis } from '@/lib/redis';
import { fetchCachedTickerData } from '@/lib/fetchCachedTickerData';

export async function GET(request: NextRequest) {
  // Verify the request is from Vercel Cron
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectRedis();

    // Clear ticker cache
    const keys = await redis.keys('cache:tickers:*');
    if (keys.length > 0) {
      await redis.del(keys);
    }

    if (!(await redis.exists('tickers:set'))) {
      return Response.json([]);
    }
    const tickers = await redis.sMembers('tickers:set');

    // collect all data for each ticker from async scraper funcs
    await Promise.all(
      tickers.map(async (ticker) => {
        return await fetchCachedTickerData(ticker, redis, true);
      })
    );

    // Optionally pre-warm the cache by fetching fresh data
    // This ensures the next user request is fast
    const currTime = new Date().toISOString();
    redis.set('cache:ticker:updatedate', currTime);
    console.log('Ticker data updated successfully');

    return Response.json({
      success: true,
      timestamp: currTime
    });

  } catch (error) {
    console.error('Cron job failed:', error);
    return Response.json({
      error: 'Failed to refresh ticker cache'
    }, { status: 500 });
  }
}
