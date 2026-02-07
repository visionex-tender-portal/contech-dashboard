'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, ExternalLink, MapPin, Building2, TrendingUp } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { CommandPalette } from '@/components/modals/command-palette';
import { CardGridSkeleton } from '@/components/animations/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function InvestorsPage() {
  const [investors, setInvestors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

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
    inv.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Investors</h1>
            <p className="text-muted-foreground">Discover construction tech investors and venture capital firms</p>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white dark:bg-steel-800 rounded-xl border border-steel-200 dark:border-steel-700 shadow-sm p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search investors by name, location, or type..."
              className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all text-foreground placeholder:text-muted-foreground"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filteredInvestors.length}</span> investors
            </p>
          </div>
        </div>

        {/* Investor Grid */}
        {loading ? (
          <CardGridSkeleton count={9} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInvestors.map((investor, index) => (
              <motion.div
                key={investor.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02, y: -4 }}
                transition={{ delay: index * 0.03 }}
              >
                <Link href={`/investors/${investor.id}`}>
                  <div className="h-full bg-white dark:bg-steel-800 rounded-xl border border-steel-200 dark:border-steel-700 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group">
                    {/* Gradient Top Border */}
                    <div className="h-1 bg-gradient-to-r from-accent-500 via-accent-600 to-brand-500" />
                    
                    <div className="p-6">
                      {/* Avatar & Name */}
                      <div className="flex items-start space-x-4 mb-4">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                          <span className="text-white font-bold text-xl">
                            {investor.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-foreground mb-1 line-clamp-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                            {investor.name}
                          </h3>
                          {investor.type && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent-100 dark:bg-accent-900/30 text-accent-800 dark:text-accent-300">
                              {investor.type}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-border">
                        <div>
                          <div className="flex items-center space-x-1 text-muted-foreground text-xs mb-1">
                            <TrendingUp className="w-3 h-3" />
                            <span>Investments</span>
                          </div>
                          <p className="text-2xl font-bold text-foreground">
                            {investor.investment_count || 0}
                          </p>
                        </div>
                        <div>
                          <div className="flex items-center space-x-1 text-muted-foreground text-xs mb-1">
                            <Building2 className="w-3 h-3" />
                            <span>Companies</span>
                          </div>
                          <p className="text-2xl font-bold text-foreground">
                            {investor.company_count || 0}
                          </p>
                        </div>
                      </div>

                      {/* Location */}
                      {investor.location && (
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-3">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{investor.location}</span>
                        </div>
                      )}

                      {/* Website */}
                      {investor.website && (
                        <div className="flex items-center space-x-2 text-sm text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors">
                          <ExternalLink className="w-3 h-3" />
                          <span className="truncate">{investor.website.replace(/^https?:\/\//, '')}</span>
                        </div>
                      )}

                      {/* Categories */}
                      {investor.categories && (
                        <div className="mt-4 pt-4 border-t border-border">
                          <p className="text-xs text-muted-foreground mb-2">Focus Areas</p>
                          <div className="flex flex-wrap gap-1">
                            {investor.categories.split(',').slice(0, 3).map((cat: string, i: number) => (
                              <span 
                                key={i}
                                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-steel-100 dark:bg-steel-700 text-steel-700 dark:text-steel-300"
                              >
                                {cat.trim()}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
