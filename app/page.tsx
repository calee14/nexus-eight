'use client';
import { useEffect, useState } from 'react';
// pages/index.js (for Pages Router) or app/page.js (for App Router)
import SmartTable from '../components/SmartTable'; // Adjust path based on your structure
import { trpc } from '../util/trpc';
import { SmartRow, SmartColumn } from '@/types';

export default function Home() {

  const [data, setData] = useState<SmartRow[]>([]);
  const [columns, setColumns] = useState<SmartColumn>();

  const updateData = async () => {
    const resp: SmartRow[] = await trpc.getAllTickerData.query({ refresh: false });
    setData(resp);
    setColumns({
      headers: ['Ticker', 'PEG', 'Growth', 'P/FCF', 'PE', 'PS'],
      keys: ['ticker', 'peg', 'growth', 'fcf', 'pe', 'ps']
    });
  };

  useEffect(() => {
    const pingServer = async () => {
      await updateData();
    }

    pingServer();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        {/* Centered table */}
        <div className="flex justify-center">
          <div className="w-full max-w-3xl">
            <SmartTable data={data} columns={columns} setData={setData} />
          </div>
        </div>
      </div>
    </div>
  );
}
