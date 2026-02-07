'use client';

import { motion } from 'framer-motion';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { useEffect, useState } from 'react';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  delay?: number;
  format?: (value: any) => string;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  onClick?: () => void;
}

export function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  delay = 0, 
  format,
  trend,
  onClick 
}: StatsCardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const numericValue = typeof value === 'number' ? value : 0;

  useEffect(() => {
    if (typeof value === 'number') {
      let start = 0;
      const duration = 1500;
      const increment = value / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= value) {
          setDisplayValue(value);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ delay, duration: 0.3 }}
      onClick={onClick}
      className={onClick ? 'cursor-pointer' : ''}
    >
      <div className="relative overflow-hidden rounded-xl bg-white dark:bg-steel-800 border border-steel-200 dark:border-steel-700 shadow-sm hover:shadow-xl transition-all duration-300 group">
        {/* Glassmorphism Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent dark:from-steel-700/30 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Gradient Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-500 via-brand-600 to-accent-500" />

        <div className="relative p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">
                {title}
              </p>
              <motion.p
                key={displayValue}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-3xl lg:text-4xl font-bold text-foreground"
              >
                {format ? format(displayValue) : typeof value === 'string' ? value : displayValue.toLocaleString()}
              </motion.p>
              
              {trend && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: delay + 0.3 }}
                  className={`flex items-center space-x-1 mt-2 text-sm font-medium ${
                    trend.direction === 'up' 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {trend.direction === 'up' ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span>{trend.value}% vs last month</span>
                </motion.div>
              )}
            </div>
            
            {/* Icon with Gradient Background */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: delay + 0.2, type: 'spring', stiffness: 200 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand-400 to-brand-600 dark:from-brand-500 dark:to-brand-700 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative p-3 bg-gradient-to-br from-brand-400 to-brand-600 dark:from-brand-500 dark:to-brand-700 rounded-xl">
                <Icon className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
              </div>
            </motion.div>
          </div>

          {/* Shimmer Effect on Hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
