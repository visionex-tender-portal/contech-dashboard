'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Search, Filter, Download } from 'lucide-react';
import { formatCurrency, formatDate, getStageColor } from '@/lib/utils';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function InvestmentsPage() {
  const [investments, setInvestments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState('');

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
    a.download = 'investments.csv';
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Investments</h1>
            </div>
            <Button onClick={exportToCSV} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <Card className="p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search companies, investors..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
              >
                <option value="">All Stages</option>
                {stages.map(stage => (
                  <option key={stage} value={stage}>{stage}</option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* Results */}
        <div className="mb-4 text-gray-600">
          Showing {filteredInvestments.length} of {investments.length} investments
        </div>

        {/* Investment Cards */}
        <div className="grid grid-cols-1 gap-4">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading investments...</p>
            </div>
          ) : (
            filteredInvestments.map((investment, index) => (
              <motion.div
                key={investment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">
                          {investment.company_name}
                        </h3>
                        {investment.stage && (
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStageColor(investment.stage)}`}>
                            {investment.stage}
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-500">Amount</p>
                          <p className="font-semibold text-gray-900">
                            {formatCurrency(investment.amount)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Date</p>
                          <p className="font-semibold text-gray-900">
                            {formatDate(investment.date)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Location</p>
                          <p className="font-semibold text-gray-900">
                            {investment.location || 'N/A'}
                          </p>
                        </div>
                      </div>

                      {investment.investors && (
                        <div className="mb-2">
                          <p className="text-sm text-gray-500">Investors</p>
                          <p className="text-gray-700">{investment.investors}</p>
                        </div>
                      )}

                      {investment.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {investment.description}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
