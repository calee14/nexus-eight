'use client';
import { useEffect } from 'react';
// pages/index.js (for Pages Router) or app/page.js (for App Router)
import SmartTable from '../components/SmartTable'; // Adjust path based on your structure
import { trpc } from '../util/trpc';

export default function Home() {
  // Sample data for the table
  const sampleData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Developer' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Designer' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Manager' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'Developer' },
    { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'Analyst' },
  ];

  // Define columns for the table
  const columns = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'role', header: 'Role' },
  ];

  useEffect(() => {
    const pingServer = async () => {

      const resp = await trpc.getTickers.query();
      console.log(resp);
    }

    pingServer();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        {/* Centered table */}
        <div className="flex justify-center">
          <div className="w-full max-w-3xl">
            <SmartTable data={sampleData} columns={columns} />
          </div>
        </div>
      </div>
    </div>
  );
}
