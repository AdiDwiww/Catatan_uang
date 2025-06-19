import React, { useState } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title, 
  Tooltip, 
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Pie, Doughnut, Radar } from 'react-chartjs-2';
import Card from './Card';
import { 
  ArrowsPointingOutIcon, 
  TableCellsIcon, 
  ChevronDownIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

// Register ChartJS components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title, 
  Tooltip, 
  Legend,
  Filler
);

// Theme colors that work well in light and dark modes
const colors = {
  primary: 'rgba(99, 102, 241, 0.8)',
  primaryLight: 'rgba(99, 102, 241, 0.2)',
  secondary: 'rgba(139, 92, 246, 0.8)',
  secondaryLight: 'rgba(139, 92, 246, 0.2)',
  success: 'rgba(34, 197, 94, 0.8)',
  successLight: 'rgba(34, 197, 94, 0.2)',
  danger: 'rgba(239, 68, 68, 0.8)',
  dangerLight: 'rgba(239, 68, 68, 0.2)',
  warning: 'rgba(234, 179, 8, 0.8)',
  warningLight: 'rgba(234, 179, 8, 0.2)',
  info: 'rgba(6, 182, 212, 0.8)',
  infoLight: 'rgba(6, 182, 212, 0.2)',
};

// Additional chart palette for pie/doughnut charts
const chartPalette = [
  colors.primary,
  colors.secondary,
  colors.success,
  colors.warning,
  colors.danger,
  colors.info,
  'rgba(249, 115, 22, 0.8)', // Orange
  'rgba(20, 184, 166, 0.8)', // Teal
  'rgba(236, 72, 153, 0.8)', // Pink
  'rgba(217, 119, 6, 0.8)',  // Amber
  'rgba(168, 85, 247, 0.8)',  // Purple
  'rgba(79, 70, 229, 0.8)',   // Indigo
];

// Common chart options
const commonOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 1000,
  },
  plugins: {
    legend: {
      position: 'top',
      labels: {
        boxWidth: 15,
        usePointStyle: true,
        pointStyle: 'circle',
        padding: 15,
      },
    },
  },
};

// Component for advanced line chart
export function AdvancedLineChart({ 
  title, 
  data, 
  xAxisKey = 'date', 
  yAxisKeys = ['value'], 
  yAxisLabels = ['Value'],
  showTable = true,
  formatXAxis = (x) => x,
  formatYAxis = (y) => y,
  height = 'h-80'
}) {
  const [viewMode, setViewMode] = useState('chart');
  const [showOptions, setShowOptions] = useState(false);
  
  // Prepare chart data
  const chartData = {
    labels: data.map(item => formatXAxis(item[xAxisKey])),
    datasets: yAxisKeys.map((key, index) => ({
      label: yAxisLabels[index] || key,
      data: data.map(item => item[key]),
      borderColor: Object.values(colors)[index % Object.values(colors).length],
      backgroundColor: Object.values(colors)[index % Object.values(colors).length].replace('0.8', '0.2'),
      fill: true,
      tension: 0.4,
      borderWidth: 2,
      pointBackgroundColor: Object.values(colors)[index % Object.values(colors).length],
    }))
  };
  
  // Line chart options
  const lineOptions = {
    ...commonOptions,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: value => formatYAxis(value)
        },
        grid: {
          display: true,
          drawBorder: false,
        },
      },
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
      }
    },
    plugins: {
      ...commonOptions.plugins,
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${formatYAxis(value)}`;
          }
        }
      }
    }
  };
  
  // Toggle view mode between chart and table
  const toggleViewMode = () => {
    setViewMode(viewMode === 'chart' ? 'table' : 'chart');
  };
  
  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          {title}
        </h3>
        <div className="flex space-x-2">
          {showOptions && (
            <button
              onClick={() => setShowOptions(!showOptions)}
              className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700"
              title="Chart Options"
            >
              <AdjustmentsHorizontalIcon className="w-5 h-5" />
            </button>
          )}
          {showTable && (
            <button
              onClick={toggleViewMode}
              className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700"
              title={viewMode === 'chart' ? 'Show Table' : 'Show Chart'}
            >
              {viewMode === 'chart' ? 
                <TableCellsIcon className="w-5 h-5" /> : 
                <ArrowsPointingOutIcon className="w-5 h-5" />
              }
            </button>
          )}
        </div>
      </div>
      
      {showOptions && (
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Chart Options</h4>
          <div className="flex flex-wrap gap-2">
            {yAxisKeys.map((key, index) => (
              <div key={key} className="flex items-center">
                <span 
                  className="w-3 h-3 mr-1 rounded-full" 
                  style={{ backgroundColor: Object.values(colors)[index % Object.values(colors).length] }}
                ></span>
                <span className="text-sm text-gray-600 dark:text-gray-400">{yAxisLabels[index] || key}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className={height}>
        {viewMode === 'chart' ? (
          <Line data={chartData} options={lineOptions} />
        ) : (
          <div className="overflow-auto max-h-full">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {xAxisKey}
                  </th>
                  {yAxisKeys.map((key, index) => (
                    <th key={key} className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {yAxisLabels[index] || key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {data.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                      {formatXAxis(item[xAxisKey])}
                    </td>
                    {yAxisKeys.map(key => (
                      <td key={key} className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900 dark:text-gray-300">
                        {formatYAxis(item[key])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Card>
  );
}

// Component for advanced bar chart
export function AdvancedBarChart({
  title,
  data,
  labelKey,
  valueKey,
  secondaryValueKey = null,
  labelForPrimary = 'Value',
  labelForSecondary = 'Secondary',
  horizontal = true,
  showTable = true,
  formatLabel = (x) => x,
  formatValue = (y) => y,
  height = 'h-80'
}) {
  const [viewMode, setViewMode] = useState('chart');
  
  // Prepare chart data
  const chartData = {
    labels: data.map(item => formatLabel(item[labelKey])),
    datasets: [
      {
        label: labelForPrimary,
        data: data.map(item => item[valueKey]),
        backgroundColor: colors.secondary,
        borderRadius: 6,
        barThickness: 'flex',
      },
      ...(secondaryValueKey ? [{
        label: labelForSecondary,
        data: data.map(item => item[secondaryValueKey]),
        backgroundColor: colors.primary,
        borderRadius: 6,
        barThickness: 'flex',
      }] : [])
    ]
  };
  
  // Bar chart options
  const barOptions = {
    ...commonOptions,
    indexAxis: horizontal ? 'y' : 'x',
    scales: {
      [horizontal ? 'x' : 'y']: {
        beginAtZero: true,
        ticks: {
          callback: value => formatValue(value)
        },
        grid: {
          display: true,
          drawBorder: false,
        },
      },
      [horizontal ? 'y' : 'x']: {
        grid: {
          display: false,
          drawBorder: false,
        },
      }
    },
    plugins: {
      ...commonOptions.plugins,
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.raw;
            return `${label}: ${formatValue(value)}`;
          }
        }
      }
    }
  };
  
  // Toggle view mode between chart and table
  const toggleViewMode = () => {
    setViewMode(viewMode === 'chart' ? 'table' : 'chart');
  };
  
  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          {title}
        </h3>
        {showTable && (
          <button
            onClick={toggleViewMode}
            className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700"
            title={viewMode === 'chart' ? 'Show Table' : 'Show Chart'}
          >
            {viewMode === 'chart' ? 
              <TableCellsIcon className="w-5 h-5" /> : 
              <ArrowsPointingOutIcon className="w-5 h-5" />
            }
          </button>
        )}
      </div>
      
      <div className={height}>
        {viewMode === 'chart' ? (
          <Bar data={chartData} options={barOptions} />
        ) : (
          <div className="overflow-auto max-h-full">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {labelKey}
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {labelForPrimary}
                  </th>
                  {secondaryValueKey && (
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {labelForSecondary}
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {data.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                      {formatLabel(item[labelKey])}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900 dark:text-gray-300">
                      {formatValue(item[valueKey])}
                    </td>
                    {secondaryValueKey && (
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900 dark:text-gray-300">
                        {formatValue(item[secondaryValueKey])}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Card>
  );
}

// Component for advanced pie/doughnut chart
export function AdvancedPieChart({
  title,
  data,
  labelKey,
  valueKey,
  type = 'pie', // 'pie' or 'doughnut'
  showTable = true,
  formatLabel = (x) => x,
  formatValue = (y) => y,
  height = 'h-80'
}) {
  const [viewMode, setViewMode] = useState('chart');
  
  // Prepare chart data
  const chartData = {
    labels: data.map(item => formatLabel(item[labelKey])),
    datasets: [
      {
        data: data.map(item => item[valueKey]),
        backgroundColor: chartPalette,
        borderWidth: 1,
        hoverOffset: 5,
      }
    ],
  };
  
  // Pie/Doughnut chart options
  const pieOptions = {
    ...commonOptions,
    plugins: {
      ...commonOptions.plugins,
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            const total = context.chart.getDatasetMeta(0).total;
            const percentage = Math.round((value / total) * 100);
            return `${formatValue(value)} (${percentage}%)`;
          }
        }
      }
    }
  };
  
  // Toggle view mode between chart and table
  const toggleViewMode = () => {
    setViewMode(viewMode === 'chart' ? 'table' : 'chart');
  };
  
  // Calculate total
  const total = data.reduce((sum, item) => sum + item[valueKey], 0);
  
  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          {title}
        </h3>
        {showTable && (
          <button
            onClick={toggleViewMode}
            className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700"
            title={viewMode === 'chart' ? 'Show Table' : 'Show Chart'}
          >
            {viewMode === 'chart' ? 
              <TableCellsIcon className="w-5 h-5" /> : 
              <ArrowsPointingOutIcon className="w-5 h-5" />
            }
          </button>
        )}
      </div>
      
      <div className={height}>
        {viewMode === 'chart' ? (
          type === 'pie' ? (
            <Pie data={chartData} options={pieOptions} />
          ) : (
            <Doughnut data={chartData} options={pieOptions} />
          )
        ) : (
          <div className="overflow-auto max-h-full">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {labelKey}
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Percentage
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {data.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                      <div className="flex items-center">
                        <span 
                          className="w-3 h-3 mr-2 rounded-full" 
                          style={{ backgroundColor: chartPalette[index % chartPalette.length] }}
                        ></span>
                        {formatLabel(item[labelKey])}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900 dark:text-gray-300">
                      {formatValue(item[valueKey])}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900 dark:text-gray-300">
                      {total > 0 ? `${Math.round((item[valueKey] / total) * 100)}%` : '0%'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Card>
  );
} 