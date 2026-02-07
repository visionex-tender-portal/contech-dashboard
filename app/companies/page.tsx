'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, ExternalLink, MapPin, DollarSign, Calendar, TrendingUp } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { CommandPalette } from '@/components/modals/command-palette';
import { CardGridSkeleton } from '@/components/animations/skeleton';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/companies');
      const result = await response.json();
      if (result.success) {
        setCompanies(result.data);
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.categories?.toLowerCase().includes(searchTerm.toLowerCase())
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
            <h1 className="text-4xl font-bold text-foreground mb-2">Companies</h1>
            <p className="text-muted-foreground">Explore construction tech startups and scale-ups</p>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white dark:bg-steel-800 rounded-xl border border-steel-200 dark:border-steel-700 shadow-sm p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search companies by name, location, category..."
              className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all text-foreground placeholder:text-muted-foreground"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filteredCompanies.length}</span> companies
            </p>
          </div>
        </div>

        {/* Company Grid */}
        {loading ? (
          <CardGridSkeleton count={9} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company, index) => (
              <motion.div
                key={company.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02, y: -4 }}
                transition={{ delay: index * 0.03 }}
              >
                <div className="h-full bg-white dark:bg-steel-800 rounded-xl border border-steel-200 dark:border-steel-700 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group">
                  {/* Gradient Top Border */}
                  <div className="h-1 bg-gradient-to-r from-brand-500 via-brand-600 to-accent-500" />
                  
                  <div className="p-6">
                    {/* Company Header */}
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center flex-shrink-0 shadow-md">
                        <span className="text-white font-bold text-lg">
                          {company.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-foreground line-clamp-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors mb-1">
                          {company.name}
                        </h3>
                        {company.website && (
                          <a 
                            href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-1 text-xs text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span className="truncate">{company.website.replace(/^https?:\/\//, '')}</span>
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    {company.description && (
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                        {company.description}
                      </p>
                    )}

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-border">
                      <div>
                        <div className="flex items-center space-x-1 text-muted-foreground text-xs mb-1">
                          <DollarSign className="w-3 h-3" />
                          <span>Total Funding</span>
                        </div>
                        <p className="text-lg font-bold text-foreground">
                          {formatCurrency(company.total_funding)}
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center space-x-1 text-muted-foreground text-xs mb-1">
                          <TrendingUp className="w-3 h-3" />
                          <span>Investments</span>
                        </div>
                        <p className="text-lg font-bold text-foreground">
                          {company.investment_count || 0}
                        </p>
                      </div>
                    </div>

                    {/* Location */}
                    {company.location && (
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-3">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{company.location}</span>
                      </div>
                    )}

                    {/* Founded */}
                    {company.founded && (
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-3">
                        <Calendar className="w-4 h-4 flex-shrink-0" />
                        <span>Founded in {company.founded}</span>
                      </div>
                    )}

                    {/* Categories */}
                    {company.categories && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <p className="text-xs text-muted-foreground mb-2">Categories</p>
                        <div className="flex flex-wrap gap-1">
                          {company.categories.split(',').slice(0, 3).map((cat: string, i: number) => (
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

                    {/* Latest Round */}
                    {company.latest_round && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <p className="text-xs text-muted-foreground mb-1">Latest Round</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-foreground">
                            {company.latest_round}
                          </span>
                          {company.latest_round_amount && (
                            <span className="text-sm font-bold text-brand-600 dark:text-brand-400">
                              {formatCurrency(company.latest_round_amount)}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
