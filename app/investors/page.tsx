'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Search, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function InvestorsPage() {
  const [investors, setInvestors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchInvestors();
  }, []);

  const fetchInvestors = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/investors');
      const result = await response.json();
      if (result.success) {
        setInvestors(result.data);
      }
    } catch (error) {
      console.error('Error fetching investors:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredInvestors = investors.filter(inv =>
    inv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Investors</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <Card className="p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search investors..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </Card>

        <div className="mb-4 text-gray-600">
          Showing {filteredInvestors.length} investors
        </div>

        {/* Investor Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">Loading investors...</p>
            </div>
          ) : (
            filteredInvestors.map((investor, index) => (
              <motion.div
                key={investor.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/investors/${investor.id}`}>
                  <Card className="p-6 hover:shadow-lg transition-all cursor-pointer h-full">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-bold text-gray-900">
                        {investor.name}
                      </h3>
                      {investor.type && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {investor.type}
                        </span>
                      )}
                    </div>

                    {investor.location && (
                      <p className="text-sm text-gray-600 mb-3">
                        📍 {investor.location}
                      </p>
                    )}

                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-500">Investments</p>
                        <p className="text-xl font-bold text-blue-600">
                          {investor.investment_count || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Companies</p>
                        <p className="text-xl font-bold text-blue-600">
                          {investor.company_count || 0}
                        </p>
                      </div>
                    </div>

                    {investor.website && (
                      <a
                        href={investor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Visit Website
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    )}
                  </Card>
                </Link>
              </motion.div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
