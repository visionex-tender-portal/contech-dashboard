import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  if (!amount) return 'Undisclosed';
  
  if (amount >= 1_000_000_000) {
    return `$${(amount / 1_000_000_000).toFixed(1)}B`;
  }
  if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (amount >= 1_000) {
    return `$${(amount / 1_000).toFixed(0)}K`;
  }
  return `$${amount.toFixed(0)}`;
}

export function formatDate(date: string | Date): string {
  if (!date) return 'N/A';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function getStageColor(stage: string): string {
  const colors: Record<string, string> = {
    'Seed': 'bg-green-100 text-green-800 border-green-300',
    'Series A': 'bg-blue-100 text-blue-800 border-blue-300',
    'Series B': 'bg-purple-100 text-purple-800 border-purple-300',
    'Series C': 'bg-pink-100 text-pink-800 border-pink-300',
    'Series D': 'bg-orange-100 text-orange-800 border-orange-300',
    'Series E': 'bg-red-100 text-red-800 border-red-300',
    'Growth': 'bg-indigo-100 text-indigo-800 border-indigo-300',
    'Late Stage': 'bg-gray-100 text-gray-800 border-gray-300',
  };
  return colors[stage] || 'bg-gray-100 text-gray-800 border-gray-300';
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
