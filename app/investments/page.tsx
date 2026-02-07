'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, Filter, Download, Grid3X3, List, TrendingUp, Calendar, MapPin, Users as UsersIcon, DollarSign } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { CommandPalette } from '@/components/modals/command-palette';
import { CardGridSkeleton } from '@/components/animations/skeleton';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate, getStageColor } from '@/lib/utils';
import Link from 'next/link';

type ViewMode = 'grid' | 'list';

export default function InvestmentsPage() {
  const [investments, setInvestments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    fetchInvestments();
  }, [selectedStage]);

  const fetchInvestments = async () => {
    setLoading(true);
    try {
      let url = '/api/investments?limit=100';
      if (selectedStage) url += `&stage=${selectedStage}`;
      
      const response = await fetch(url);
      const result = await response.json();
      if (result.success) {
        setInvestments(result.data);
      }
    } catch (error) {
      console.error('Error fetching investments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredInvestments = investments.filter(inv =>
    inv.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.investors?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stages = [...new Set(investments.map(inv => inv.stage).filter(Boolean))];

  const exportToCSV = () => {
    const headers = ['Company', 'Amount', 'Stage', 'Date', 'Location', 'Investors'];
    const rows = filteredInvestments.map(inv => [
      inv.company_name,
      inv.amount || 'Undisclosed',
      inv.stage || 'N/A',
      inv.date || 'N/A',
      inv.location || 'N/A',
      inv.investors || 'N/A'
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contech-investments.csv';
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-steel-50 to-brand-100 dark:from-steel-950 dark:via-steel-900 dark:to-brand-950">
      <Header onSearchOpen={() => setSearchOpen(true)} />
      <CommandPalette isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Investments</h1>
              <p className="text-muted-foreground">Browse construction tech funding rounds and deals</p>
            </div>
          </div>
        </div>

        {/* Filters & Controls */}
        <div className="bg-white dark:bg-steel-800 rounded-xl border border-steel-200 dark:border-steel-700 shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search companies, investors, descriptions..."
                className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all text-foreground placeholder:text-muted-foreground"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Stage Filter */}
            <select
              className="px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all text-foreground min-w-[160px]"
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
            >
              <option value="">All Stages</option>
              {stages.map(stage => (
                <option key={stage} value={stage}>{stage}</option>
              ))}
            </select>

            {/* View Toggle */}
            <div className="flex items-center space-x-2 border border-border rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-brand-500 text-white'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'list'
                    ? 'bg-brand-500 text-white'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Export */}
            <Button onClick={exportToCSV} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>

          {/* Results Count */}
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filteredInvestments.length}</span> of{' '}
              <span className="font-semibold text-foreground">{investments.length}</span> investments
            </p>
          </div>
        </div>

        {/* Investment Cards/List */}
        {loading ? (
          <CardGridSkeleton count={6} />
        ) : (
          <AnimatePresence mode="wait">
            {viewMode === 'grid' ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                {filteredInvestments.map((investment, index) => (
                  <motion.div
                    key={investment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    whileHover={{ y: -4 }}
                    className="group"
                  >
                    <div className="h-full bg-white dark:bg-steel-800 rounded-xl border border-steel-200 dark:border-steel-700 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
                      {/* Gradient Top Border */}
                      <div className="h-1 bg-gradient-to-r from-brand-500 via-brand-600 to-accent-500" />
                      
                      <div className="p-6">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                              {investment.company_name}
                            </h3>
                            {investment.stage && (
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStageColor(investment.stage)}`}>
                                {investment.stage}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2 text-muted-foreground text-xs">
                              <DollarSign className="w-3 h-3" />
                              <span>Amount</span>
                            </div>
                            <p className="font-semibold text-foreground text-lg">
                              {formatCurrency(investment.amount)}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2 text-muted-foreground text-xs">
                              <Calendar className="w-3 h-3" />
                              <span>Date</span>
                            </div>
                            <p className="font-semibold text-foreground">
                              {formatDate(investment.date)}
                            </p>
                          </div>
                        </div>

                        {/* Location */}
                        {investment.location && (
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-3">
                            <MapPin className="w-4 h-4" />
                            <span>{investment.location}</span>
                          </div>
                        )}

                        {/* Investors */}
                        {investment.investors && (
                          <div className="mb-3">
                            <div className="flex items-center space-x-2 text-xs text-muted-foreground mb-1">
                              <UsersIcon className="w-3 h-3" />
                              <span>Investors</span>
                            </div>
                            <p className="text-sm text-foreground line-clamp-2">{investment.investors}</p>
                          </div>
                        )}

                        {/* Description */}
                        {investment.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-3 pt-3 border-t border-border">
                            {investment.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white dark:bg-steel-800 rounded-xl border border-steel-200 dark:border-steel-700 shadow-sm overflow-hidden"
              >
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-steel-50 dark:bg-steel-900/50 border-b border-border">
                      <tr>
                        <th className="text-left py-4 px-6 font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                          Company
                        </th>
                        <th className="text-left py-4 px-6 font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                          Stage
                        </th>
                        <th className="text-right py-4 px-6 font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="text-left py-4 px-6 font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                          Date
                        </th>
                        <th className="text-left py-4 px-6 font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                          Location
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredInvestments.map((investment, index) => (
                        <motion.tr
                          key={investment.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.03 }}
                          className="hover:bg-steel-50 dark:hover:bg-steel-900/30 transition-colors"
                        >
                          <td className="py-4 px-6">
                            <span className="font-medium text-foreground">{investment.company_name}</span>
                          </td>
                          <td className="py-4 px-6">
                            {investment.stage && (
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStageColor(investment.stage)}`}>
                                {investment.stage}
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-6 text-right font-semibold text-foreground">
                            {formatCurrency(investment.amount)}
                          </td>
                          <td className="py-4 px-6 text-muted-foreground">
                            {formatDate(investment.date)}
                          </td>
                          <td className="py-4 px-6 text-muted-foreground">
                            {investment.location || 'N/A'}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>
    </div>
  );
}
