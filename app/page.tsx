'use client';

import { useEffect, useState } from 'react';
import { StatsCard } from '@/components/dashboard/stats-card';
import { TimelineChart } from '@/components/charts/timeline-chart';
import { StageChart } from '@/components/charts/stage-chart';
import { TrendingUp, Building2, Users, DollarSign, Search, RefreshCw } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface DashboardData {
  stats: {
    totalInvestments: number;
    totalCompanies: number;
    totalInvestors: number;
    totalFunding: number;
  };
  timeline: Array<{ date: string; count: number; total_amount: number }>;
  stageDistribution: Array<{ stage: string; count: number }>;
  topInvestors: Array<any>;
  categories: Array<any>;
  locations: Array<any>;
}

export default function Home() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/stats');
      const result = await response.json();
      if (result.success) {
        setData(result.data);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-sm border-b border-gray-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Construction Tech Intelligence
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Real-time investment data and market insights
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-xs text-gray-500">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
              <Button onClick={fetchData} variant="outline" size="sm">
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Investments"
            value={data.stats.totalInvestments}
            icon={TrendingUp}
            delay={0.1}
          />
          <StatsCard
            title="Companies"
            value={data.stats.totalCompanies}
            icon={Building2}
            delay={0.2}
          />
          <StatsCard
            title="Investors"
            value={data.stats.totalInvestors}
            icon={Users}
            delay={0.3}
          />
          <StatsCard
            title="Total Funding"
            value={data.stats.totalFunding}
            icon={DollarSign}
            delay={0.4}
            format={formatCurrency}
          />
        </div>

        {/* Quick Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <Link href="/investments">
            <Button className="w-full h-16 text-lg" variant="outline">
              <TrendingUp className="w-5 h-5 mr-2" />
              Browse Investments
            </Button>
          </Link>
          <Link href="/companies">
            <Button className="w-full h-16 text-lg" variant="outline">
              <Building2 className="w-5 h-5 mr-2" />
              View Companies
            </Button>
          </Link>
          <Link href="/investors">
            <Button className="w-full h-16 text-lg" variant="outline">
              <Users className="w-5 h-5 mr-2" />
              Explore Investors
            </Button>
          </Link>
        </motion.div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <TimelineChart data={data.timeline} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <StageChart data={data.stageDistribution} />
          </motion.div>
        </div>

        {/* Top Investors Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Top Investors</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Location</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Investments</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Companies</th>
                </tr>
              </thead>
              <tbody>
                {data.topInvestors.map((investor: any, index: number) => (
                  <motion.tr
                    key={investor.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + index * 0.05 }}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => window.location.href = `/investors/${investor.id}`}
                  >
                    <td className="py-3 px-4 font-medium text-blue-600">{investor.name}</td>
                    <td className="py-3 px-4 text-gray-600">{investor.type || 'N/A'}</td>
                    <td className="py-3 px-4 text-gray-600">{investor.location || 'N/A'}</td>
                    <td className="py-3 px-4 text-right text-gray-900 font-semibold">
                      {investor.investment_count}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-900 font-semibold">
                      {investor.company_count}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
