'use client';
import { useEffect, useState } from 'react';
// pages/index.js (for Pages Router) or app/page.js (for App Router)
import SmartTable from '../components/SmartTable'; // Adjust path based on your structure
import { trpc } from '../lib/trpc';
import { SmartRow, SmartColumn } from '@/types';
import { reorderList } from '@/util/reorderList';

export default function Home() {

  const [data, setData] = useState<SmartRow[]>([]);
  const [columns, setColumns] = useState<SmartColumn>();

  const updateData = async () => {
    const resp: SmartRow[] = await trpc.getAllTickerData.query({ refresh: false });
    updateDataRanked(resp);
    setColumns({
      headers: ['Ticker', 'PEG', 'Growth', 'P/FCF', 'PE', 'PS'],
      keys: ['ticker', 'peg', 'growth', 'fcf', 'pe', 'ps']
    });
  };

  const updateDataRanked = (data: SmartRow[]) => {
    const ranks = data.map((row, i) => {
      const pegData = (row.peg)!.map(ele => ele.at(1) as number);
      const currPegValue = (row.peg)!.at(0)?.at(1) as number;
      const minPegRange = Math.min(...pegData.slice(1));
      const maxPegRange = Math.max(...pegData.slice(1));

      const pegRank = currPegValue > maxPegRange ? 0
        : currPegValue > (maxPegRange + minPegRange) / 2 ? 1
          : currPegValue > minPegRange ? 4
            : 5;

      const growthData = (row.growth)!.map(ele => ele.at(1) as number);
      const currGrowthValue = (row.growth)!.at(0)?.at(1) as number;
      const minGrowthRange = Math.min(...growthData.slice(1));
      const maxGrowthRange = Math.max(...growthData.slice(1));

      const growthRank = currGrowthValue > maxGrowthRange ? 5
        : currGrowthValue > (maxGrowthRange + minGrowthRange) / 2 ? 4
          : currGrowthValue > minGrowthRange ? 2
            : 1;
      return [pegRank + growthRank, i];
    });

    ranks.sort((a, b) => a[0] - b[0]);
    const newData = reorderList(data, ranks.map((ele) => ele[1])).reverse();
    setData(newData);
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
            <SmartTable data={data} columns={columns} setData={updateDataRanked} />
          </div>
        </div>
      </div>
    </div>
  );
}
