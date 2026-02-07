'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, ComposedChart } from 'recharts';

interface TimelineChartProps {
  data: Array<{
    date: string;
    count: number;
    total_amount: number;
  }>;
}

export function TimelineChart({ data }: TimelineChartProps) {
  const formattedData = data.map(item => ({
    ...item,
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-steel-800 border border-steel-200 dark:border-steel-700 rounded-lg shadow-xl p-4">
          <p className="font-semibold text-foreground mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-sm text-brand-600 dark:text-brand-400">
              Investments: <span className="font-semibold">{payload[0].value}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-steel-800 rounded-xl border border-steel-200 dark:border-steel-700 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-steel-200 dark:border-steel-700">
        <h3 className="text-lg font-semibold text-foreground">Investment Timeline</h3>
        <p className="text-sm text-muted-foreground mt-1">Monthly investment activity over time</p>
      </div>
      <div className="p-6">
        <ResponsiveContainer width="100%" height={320}>
          <ComposedChart data={formattedData}>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="currentColor"
              className="text-steel-200 dark:text-steel-700"
              vertical={false}
            />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12, fill: 'currentColor' }}
              className="text-muted-foreground"
              stroke="currentColor"
              tickLine={false}
              axisLine={{ stroke: 'currentColor', className: 'text-steel-300 dark:text-steel-700' }}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: 'currentColor' }}
              className="text-muted-foreground"
              stroke="currentColor"
              tickLine={false}
              axisLine={{ stroke: 'currentColor', className: 'text-steel-300 dark:text-steel-700' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="count"
              fill="url(#colorCount)"
              stroke="none"
            />
            <Line 
              type="monotone" 
              dataKey="count" 
              stroke="#0ea5e9"
              strokeWidth={3}
              name="Investments"
              dot={{ 
                r: 4, 
                fill: '#0ea5e9',
                strokeWidth: 2,
                stroke: '#fff'
              }}
              activeDot={{ 
                r: 6,
                fill: '#0ea5e9',
                strokeWidth: 3,
                stroke: '#fff'
              }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
