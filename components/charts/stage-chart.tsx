'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { motion } from 'framer-motion';

interface StageChartProps {
  data: Array<{
    stage: string;
    count: number;
  }>;
}

const STAGE_COLORS: { [key: string]: string } = {
  'Seed': '#10b981',
  'Series A': '#3b82f6',
  'Series B': '#8b5cf6',
  'Series C': '#ec4899',
  'Series D+': '#f59e0b',
  'Growth': '#06b6d4',
  'Pre-Seed': '#6ee7b7',
  'default': '#64748b'
};

export function StageChart({ data }: StageChartProps) {
  const total = data.reduce((sum, item) => sum + item.count, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = ((data.value / total) * 100).toFixed(1);
      return (
        <div className="bg-white dark:bg-steel-800 border border-steel-200 dark:border-steel-700 rounded-lg shadow-xl p-4">
          <p className="font-semibold text-foreground mb-2">{data.name}</p>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              Count: <span className="font-semibold text-foreground">{data.value}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Percentage: <span className="font-semibold text-foreground">{percentage}%</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null; // Don't show label for very small slices

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-xs font-semibold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="bg-white dark:bg-steel-800 rounded-xl border border-steel-200 dark:border-steel-700 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-steel-200 dark:border-steel-700">
        <h3 className="text-lg font-semibold text-foreground">Stage Distribution</h3>
        <p className="text-sm text-muted-foreground mt-1">Investment breakdown by funding stage</p>
      </div>
      <div className="p-6">
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={CustomLabel}
              innerRadius={70}
              outerRadius={110}
              fill="#8884d8"
              dataKey="count"
              paddingAngle={2}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={STAGE_COLORS[entry.stage] || STAGE_COLORS.default}
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Custom Legend */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          {data.map((entry, index) => (
            <motion.div
              key={entry.stage}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center space-x-2"
            >
              <div 
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: STAGE_COLORS[entry.stage] || STAGE_COLORS.default }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{entry.stage}</p>
                <p className="text-xs text-muted-foreground">{entry.count} deals</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
