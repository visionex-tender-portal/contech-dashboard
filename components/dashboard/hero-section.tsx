'use client';

import { motion } from 'framer-motion';
import { Search, TrendingUp, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  onSearchOpen?: () => void;
}

export function HeroSection({ onSearchOpen }: HeroSectionProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-brand-500 via-brand-600 to-brand-800 dark:from-brand-900 dark:via-steel-900 dark:to-steel-950">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center">
          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
              Construction Tech
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-accent-600">
                Investment Intelligence
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-lg sm:text-xl text-brand-100 dark:text-steel-300 max-w-3xl mx-auto"
          >
            Real-time analytics and insights into the construction technology investment landscape
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 max-w-2xl mx-auto"
          >
            <button
              onClick={onSearchOpen}
              className="w-full flex items-center space-x-3 px-6 py-4 bg-white/10 dark:bg-steel-800/50 backdrop-blur-lg border border-white/20 dark:border-steel-700 rounded-xl hover:bg-white/20 dark:hover:bg-steel-800/70 transition-all group"
            >
              <Search className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
              <span className="flex-1 text-left text-white/70 group-hover:text-white transition-colors">
                Search companies, investors, investments...
              </span>
              <kbd className="hidden sm:inline-flex px-3 py-1.5 text-xs font-semibold text-white/90 bg-white/10 border border-white/20 rounded-lg">
                ⌘K
              </kbd>
            </button>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            <Button
              size="lg"
              className="bg-white text-brand-700 hover:bg-brand-50 shadow-lg hover:shadow-xl transition-all"
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              Explore Investments
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-sm"
            >
              <Download className="w-5 h-5 mr-2" />
              Export Data
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="text-white hover:bg-white/10"
            >
              <Share2 className="w-5 h-5 mr-2" />
              Share
            </Button>
          </motion.div>

          {/* Live Stats Ticker */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-white/80"
          >
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>Live Data</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-white/20" />
            <span className="hidden sm:inline">Updated every 5 minutes</span>
          </motion.div>
        </div>
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-12 fill-current text-background"
        >
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" />
        </svg>
      </div>
    </div>
  );
}
