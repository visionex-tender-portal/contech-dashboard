'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, MapPin, Building2, TrendingUp, Users, DollarSign, Calendar } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { CommandPalette } from '@/components/modals/command-palette';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate, getStageColor } from '@/lib/utils';
import Link from 'next/link';

export default function InvestorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [investor, setInvestor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [investorId, setInvestorId] = useState<string>('');
  const [searchOpen, setSearchOpen] = useState(false);

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
      <div className="min-h-screen bg-gradient-to-br from-brand-50 via-steel-50 to-brand-100 dark:from-steel-950 dark:via-steel-900 dark:to-brand-950 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!investor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-50 via-steel-50 to-brand-100 dark:from-steel-950 dark:via-steel-900 dark:to-brand-950">
        <Header onSearchOpen={() => setSearchOpen(true)} />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Investor not found</h1>
          <Link href="/investors">
            <Button variant="outline">Back to Investors</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-steel-50 to-brand-100 dark:from-steel-950 dark:via-steel-900 dark:to-brand-950">
      <Header onSearchOpen={() => setSearchOpen(true)} />
      <CommandPalette isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link href="/investors">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Investors
          </Button>
        </Link>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-gradient-to-br from-accent-500 via-accent-600 to-brand-600 rounded-2xl shadow-xl mb-8"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>

          <div className="relative p-8 sm:p-12">
            <div className="flex items-start space-x-6">
              {/* Avatar */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center flex-shrink-0 shadow-2xl">
                <span className="text-white font-bold text-3xl sm:text-4xl">
                  {investor.name.charAt(0).toUpperCase()}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center flex-wrap gap-3 mb-2">
                  <h1 className="text-3xl sm:text-4xl font-bold text-white">
                    {investor.name}
                  </h1>
                  {investor.type && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 backdrop-blur-sm text-white border border-white/30">
                      {investor.type}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-white/90 mb-4">
                  {investor.location && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>{investor.location}</span>
                    </div>
                  )}
                  {investor.website && (
                    <a 
                      href={investor.website.startsWith('http') ? investor.website : `https://${investor.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 hover:text-white transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span className="truncate max-w-xs">{investor.website.replace(/^https?:\/\//, '')}</span>
                    </a>
                  )}
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3">
                    <div className="text-white/80 text-xs mb-1">Investments</div>
                    <div className="text-white text-2xl font-bold">{investor.portfolio?.length || 0}</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3">
                    <div className="text-white/80 text-xs mb-1">Companies</div>
                    <div className="text-white text-2xl font-bold">{investor.companies?.length || 0}</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3">
                    <div className="text-white/80 text-xs mb-1">Co-Investors</div>
                    <div className="text-white text-2xl font-bold">{investor.co_investors?.length || 0}</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3">
                    <div className="text-white/80 text-xs mb-1">Categories</div>
                    <div className="text-white text-2xl font-bold">{investor.categories?.split(',').length || 0}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Portfolio */}
          <div className="lg:col-span-2 space-y-6">
            {/* Portfolio Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="bg-white dark:bg-steel-800 rounded-xl border border-steel-200 dark:border-steel-700 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border">
                  <h2 className="text-2xl font-bold text-foreground flex items-center space-x-2">
                    <TrendingUp className="w-6 h-6 text-brand-500" />
                    <span>Portfolio</span>
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {investor.portfolio?.length || 0} investment{(investor.portfolio?.length || 0) !== 1 ? 's' : ''}
                  </p>
                </div>

                <div className="divide-y divide-border">
                  {investor.portfolio?.length > 0 ? (
                    investor.portfolio.map((investment: any, index: number) => (
                      <motion.div
                        key={investment.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + index * 0.05 }}
                        className="p-6 hover:bg-steel-50 dark:hover:bg-steel-900/30 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-foreground mb-1">
                              {investment.company_name}
                            </h3>
                            {investment.stage && (
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStageColor(investment.stage)}`}>
                                {investment.stage}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                          <div>
                            <div className="flex items-center space-x-1 text-muted-foreground text-xs mb-1">
                              <DollarSign className="w-3 h-3" />
                              <span>Amount</span>
                            </div>
                            <p className="font-semibold text-foreground">
                              {formatCurrency(investment.amount)}
                            </p>
                          </div>
                          <div>
                            <div className="flex items-center space-x-1 text-muted-foreground text-xs mb-1">
                              <Calendar className="w-3 h-3" />
                              <span>Date</span>
                            </div>
                            <p className="font-semibold text-foreground">
                              {formatDate(investment.date)}
                            </p>
                          </div>
                          {investment.location && (
                            <div>
                              <div className="flex items-center space-x-1 text-muted-foreground text-xs mb-1">
                                <MapPin className="w-3 h-3" />
                                <span>Location</span>
                              </div>
                              <p className="font-semibold text-foreground truncate">
                                {investment.location}
                              </p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="p-12 text-center text-muted-foreground">
                      No investments recorded
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Co-Investors */}
            {investor.co_investors && investor.co_investors.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-steel-800 rounded-xl border border-steel-200 dark:border-steel-700 shadow-sm overflow-hidden"
              >
                <div className="p-6 border-b border-border">
                  <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
                    <Users className="w-5 h-5 text-accent-500" />
                    <span>Frequent Co-Investors</span>
                  </h3>
                </div>
                <div className="p-6 space-y-3">
                  {investor.co_investors.slice(0, 5).map((co: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground truncate">{co.name}</span>
                      <span className="text-xs font-semibold text-muted-foreground ml-2">{co.count}x</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Focus Areas */}
            {investor.categories && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-steel-800 rounded-xl border border-steel-200 dark:border-steel-700 shadow-sm overflow-hidden"
              >
                <div className="p-6 border-b border-border">
                  <h3 className="text-lg font-semibold text-foreground">Focus Areas</h3>
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap gap-2">
                    {investor.categories.split(',').map((cat: string, index: number) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-brand-100 dark:bg-brand-900/30 text-brand-800 dark:text-brand-300"
                      >
                        {cat.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
