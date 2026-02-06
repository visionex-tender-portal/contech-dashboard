'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function InvestorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [investor, setInvestor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [investorId, setInvestorId] = useState<string>('');

  useEffect(() => {
    params.then(p => {
      setInvestorId(p.id);
    });
  }, [params]);

  useEffect(() => {
    if (investorId) {
      fetchInvestor();
    }
  }, [investorId]);

  const fetchInvestor = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/investors/${investorId}`);
      const result = await response.json();
      if (result.success) {
        setInvestor(result.data);
      }
    } catch (error) {
      console.error('Error fetching investor:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!investor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Investor not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/investors">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Investors
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Investor Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-8 mb-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {investor.name}
                </h1>
                {investor.type && (
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full mb-3">
                    {investor.type}
                  </span>
                )}
                {investor.location && (
                  <p className="text-gray-600 mb-2">📍 {investor.location}</p>
                )}
                {investor.website && (
                  <a
                    href={investor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800"
                  >
                    Visit Website
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </a>
                )}
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Portfolio</p>
                <p className="text-3xl font-bold text-blue-600">
                  {investor.portfolio?.length || 0}
                </p>
                <p className="text-sm text-gray-500">Investments</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Portfolio */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Companies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {investor.portfolio && investor.portfolio.length > 0 ? (
                  investor.portfolio.map((investment: any) => (
                    <div
                      key={investment.id}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-lg text-gray-900">
                            {investment.company_name || investment.name}
                          </h3>
                          {investment.location && (
                            <p className="text-sm text-gray-600">
                              {investment.location}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {formatCurrency(investment.amount)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(investment.date)}
                          </p>
                        </div>
                      </div>
                      {investment.stage && (
                        <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {investment.stage}
                        </span>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No portfolio data available
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Co-investors */}
        {investor.coInvestors && investor.coInvestors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>Frequent Co-Investors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {investor.coInvestors.map((coInv: any) => (
                    <Link key={coInv.id} href={`/investors/${coInv.id}`}>
                      <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <h4 className="font-semibold text-gray-900">
                          {coInv.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {coInv.co_investment_count} co-investments
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>
    </div>
  );
}
