'use client';

import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  delay?: number;
  format?: (value: any) => string;
}

export function StatsCard({ title, value, icon: Icon, delay = 0, format }: StatsCardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const numericValue = typeof value === 'number' ? value : 0;

  useEffect(() => {
    if (typeof value === 'number') {
      let start = 0;
      const duration = 1000;
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
      transition={{ delay, duration: 0.5 }}
    >
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">
                {title}
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {format ? format(displayValue) : typeof value === 'string' ? value : displayValue}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Icon className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
