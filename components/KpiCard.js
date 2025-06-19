import { useState } from 'react';
import Card from './Card';
import { ArrowUpIcon, ArrowDownIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

export default function KpiCard({
  title,
  value,
  previousValue,
  icon: Icon,
  iconColor = 'indigo',
  formatter = val => val,
  description,
  prefix = '',
  suffix = '',
  trend = null,
  isLoading = false
}) {
  const [showInfo, setShowInfo] = useState(false);
  
  // Calculate percentage change
  const calculateChange = () => {
    if (!previousValue || previousValue === 0) return null;
    return ((value - previousValue) / previousValue) * 100;
  };
  
  // Get trend if not provided
  const getTrend = () => {
    if (trend !== null) return trend;
    
    const change = calculateChange();
    if (change === null) return null;
    return change >= 0;
  };
  
  // Format percentage
  const formatPercentage = (percentage) => {
    if (percentage === null) return '';
    return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(1)}%`;
  };
  
  // Get color based on trend
  const getTrendColor = (isPositive) => {
    if (isPositive === null) return 'text-gray-500';
    return isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
  };
  
  // Get background color for icon
  const getIconBgColor = () => {
    const colors = {
      indigo: 'bg-indigo-100 dark:bg-indigo-900',
      green: 'bg-green-100 dark:bg-green-900',
      blue: 'bg-blue-100 dark:bg-blue-900',
      red: 'bg-red-100 dark:bg-red-900',
      yellow: 'bg-yellow-100 dark:bg-yellow-900',
      purple: 'bg-purple-100 dark:bg-purple-900',
      pink: 'bg-pink-100 dark:bg-pink-900',
      gray: 'bg-gray-100 dark:bg-gray-800'
    };
    
    return colors[iconColor] || colors.indigo;
  };
  
  // Get text color for icon
  const getIconTextColor = () => {
    const colors = {
      indigo: 'text-indigo-600 dark:text-indigo-300',
      green: 'text-green-600 dark:text-green-300',
      blue: 'text-blue-600 dark:text-blue-300',
      red: 'text-red-600 dark:text-red-300',
      yellow: 'text-yellow-600 dark:text-yellow-300',
      purple: 'text-purple-600 dark:text-purple-300',
      pink: 'text-pink-600 dark:text-pink-300',
      gray: 'text-gray-600 dark:text-gray-300'
    };
    
    return colors[iconColor] || colors.indigo;
  };
  
  const currentTrend = getTrend();
  const percentageChange = calculateChange();
  const trendColor = getTrendColor(currentTrend);
  const iconBgColor = getIconBgColor();
  const iconTextColor = getIconTextColor();
  
  return (
    <Card className="relative overflow-visible">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {Icon && (
            <div className={`p-3 rounded-lg mr-4 ${iconBgColor}`}>
              <Icon className={`w-6 h-6 ${iconTextColor}`} />
            </div>
          )}
          <h3 className="text-base font-medium text-gray-900 dark:text-white">
            {title}
          </h3>
          {description && (
            <button 
              onClick={() => setShowInfo(!showInfo)}
              className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
            >
              <InformationCircleIcon className="w-5 h-5" />
            </button>
          )}
        </div>
        
        {percentageChange !== null && (
          <div className={`flex items-center ${trendColor}`}>
            {currentTrend !== null && (
              currentTrend ? (
                <ArrowUpIcon className="w-4 h-4 mr-1" />
              ) : (
                <ArrowDownIcon className="w-4 h-4 mr-1" />
              )
            )}
            <span className="text-sm font-medium">
              {formatPercentage(percentageChange)}
            </span>
          </div>
        )}
      </div>
      
      {showInfo && description && (
        <div className="mt-2 p-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded-md">
          {description}
        </div>
      )}
      
      <div className="mt-4">
        {isLoading ? (
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        ) : (
          <div className="flex items-baseline">
            {prefix && (
              <span className="text-xl text-gray-500 dark:text-gray-400 mr-1">{prefix}</span>
            )}
            <span className="text-2xl font-semibold text-gray-900 dark:text-white">
              {formatter(value)}
            </span>
            {suffix && (
              <span className="text-xl text-gray-500 dark:text-gray-400 ml-1">{suffix}</span>
            )}
          </div>
        )}
      </div>
    </Card>
  );
} 