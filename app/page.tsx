'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Building2, Users, DollarSign, RefreshCw, Download, Filter } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { HeroSection } from '@/components/dashboard/hero-section';
import { StatsCard } from '@/components/dashboard/stats-card';
import { TimelineChart } from '@/components/charts/timeline-chart';
import { StageChart } from '@/components/charts/stage-chart';
import { CommandPalette } from '@/components/modals/command-palette';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

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
  const [searchOpen, setSearchOpen] = useState(false);

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

  // Keyboard shortcut for command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (loading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 via-steel-50 to-brand-100 dark:from-steel-950 dark:via-steel-900 dark:to-brand-950">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-muted-foreground text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-steel-50 to-brand-100 dark:from-steel-950 dark:via-steel-900 dark:to-brand-950">
      <Header onSearchOpen={() => setSearchOpen(true)} />
      <CommandPalette isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Hero Section */}
      <HeroSection onSearchOpen={() => setSearchOpen(true)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Stats Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Market Overview</h2>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-muted-foreground">
                Updated {lastUpdated.toLocaleTimeString()}
              </span>
              <Button onClick={fetchData} variant="outline" size="sm" disabled={loading}>
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total Investments"
              value={data.stats.totalInvestments}
              icon={TrendingUp}
              delay={0.1}
              trend={{ value: 12.5, direction: 'up' }}
            />
            <StatsCard
              title="Companies"
              value={data.stats.totalCompanies}
              icon={Building2}
              delay={0.2}
              trend={{ value: 8.3, direction: 'up' }}
            />
            <StatsCard
              title="Investors"
              value={data.stats.totalInvestors}
              icon={Users}
              delay={0.3}
              trend={{ value: 5.7, direction: 'up' }}
            />
            <StatsCard
              title="Total Funding"
              value={data.stats.totalFunding}
              icon={DollarSign}
              delay={0.4}
              format={formatCurrency}
              trend={{ value: 15.2, direction: 'up' }}
            />
          </div>
        </section>

        {/* Quick Actions */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          <Link href="/investments" className="group">
            <div className="relative overflow-hidden rounded-xl bg-white dark:bg-steel-800 border border-steel-200 dark:border-steel-700 p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-green-400 to-green-600 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    Browse Investments
                  </h3>
                  <p className="text-sm text-muted-foreground">Explore {data.stats.totalInvestments} deals</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/companies" className="group">
            <div className="relative overflow-hidden rounded-xl bg-white dark:bg-steel-800 border border-steel-200 dark:border-steel-700 p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    View Companies
                  </h3>
                  <p className="text-sm text-muted-foreground">Discover {data.stats.totalCompanies} startups</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/investors" className="group">
            <div className="relative overflow-hidden rounded-xl bg-white dark:bg-steel-800 border border-steel-200 dark:border-steel-700 p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-accent-400 to-accent-600 rounded-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    Explore Investors
                  </h3>
                  <p className="text-sm text-muted-foreground">Connect with {data.stats.totalInvestors} investors</p>
                </div>
              </div>
            </div>
          </Link>
        </motion.section>

        {/* Charts Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Investment Trends</h2>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
        </section>

        {/* Top Investors Table */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Top Investors</h2>
            <Link href="/investors">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </div>

          <div className="bg-white dark:bg-steel-800 rounded-xl border border-steel-200 dark:border-steel-700 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-steel-50 dark:bg-steel-900/50 border-b border-steel-200 dark:border-steel-700">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                      Investor
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                      Type
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                      Location
                    </th>
                    <th className="text-right py-4 px-6 font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                      Investments
                    </th>
                    <th className="text-right py-4 px-6 font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                      Companies
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-steel-200 dark:divide-steel-700">
                  {data.topInvestors.map((investor: any, index: number) => (
                    <motion.tr
                      key={investor.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 + index * 0.05 }}
                      className="hover:bg-steel-50 dark:hover:bg-steel-900/30 transition-colors cursor-pointer group"
                      onClick={() => window.location.href = `/investors/${investor.id}`}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-semibold">
                            {investor.name.charAt(0)}
                          </div>
                          <span className="font-medium text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                            {investor.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-100 dark:bg-brand-900/30 text-brand-800 dark:text-brand-300">
                          {investor.type || 'N/A'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-muted-foreground">
                        {investor.location || 'N/A'}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span className="font-semibold text-foreground">
                          {investor.investment_count}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span className="font-semibold text-foreground">
                          {investor.company_count}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.section>

        {/* Footer */}
        <footer className="text-center py-8 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} ConTech Intelligence. Built with precision.</p>
        </footer>
      </main>
    </div>
  );
}
