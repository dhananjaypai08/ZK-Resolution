import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  TrendingUp,
  DollarSign,
  Activity,
  PieChart as PieChartIcon,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  Search
} from 'lucide-react';

// Mock data
const volumeData = [
  { date: '2023-11-01', volume_quote: 156000, volume_native_quote: 85.2 },
  { date: '2023-11-02', volume_quote: 142000, volume_native_quote: 77.5 },
  { date: '2023-11-03', volume_quote: 164000, volume_native_quote: 89.6 },
  { date: '2023-11-04', volume_quote: 185000, volume_native_quote: 101.2 },
  { date: '2023-11-05', volume_quote: 178000, volume_native_quote: 97.3 },
  { date: '2023-11-06', volume_quote: 198000, volume_native_quote: 108.4 },
  { date: '2023-11-07', volume_quote: 211000, volume_native_quote: 115.6 }
];

const floorPriceData = [
  { date: '2023-11-01', floor_price_quote: 12500, floor_price_native_quote: 6.8 },
  { date: '2023-11-02', floor_price_quote: 13200, floor_price_native_quote: 7.2 },
  { date: '2023-11-03', floor_price_quote: 12800, floor_price_native_quote: 7.0 },
  { date: '2023-11-04', floor_price_quote: 13500, floor_price_native_quote: 7.4 },
  { date: '2023-11-05', floor_price_quote: 14200, floor_price_native_quote: 7.8 },
  { date: '2023-11-06', floor_price_quote: 14800, floor_price_native_quote: 8.1 },
  { date: '2023-11-07', floor_price_quote: 15100, floor_price_native_quote: 8.3 }
];

const distributionData = [
  { name: 'Rare', value: 20 },
  { name: 'Epic', value: 15 },
  { name: 'Legendary', value: 10 },
  { name: 'Common', value: 55 }
];

const COLORS = ['#6366f1', '#8b5cf6', '#d946ef', '#f472b6'];

const ChainRegistryDashboard = () => {
  const [activeTimeframe, setActiveTimeframe] = useState('7D');

  const timeframes = ['24H', '7D', '30D', '90D'];

  const stats = [
    {
      title: 'Total Volume',
      value: '$1.23M',
      change: '+12.5%',
      icon: TrendingUp,
      positive: true
    },
    {
      title: 'Floor Price',
      value: '8.3 ETH',
      change: '+5.2%',
      icon: DollarSign,
      positive: true
    },
    {
      title: 'Unique Holders',
      value: '3,487',
      change: '-2.1%',
      icon: Users,
      positive: false
    },
    {
      title: 'Sales Count',
      value: '892',
      change: '+8.7%',
      icon: Activity,
      positive: true
    }
  ];

  return (
    <motion.div
      className="max-w-7xl mx-auto p-6 text-gray-300"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-indigo-400">NFT Analytics Dashboard</h1>
        <div className="flex items-center space-x-2 bg-gray-800 rounded-lg p-1">
          {timeframes.map((timeframe) => (
            <button
              key={timeframe}
              onClick={() => setActiveTimeframe(timeframe)}
              className={`px-4 py-2 rounded-md transition-all duration-200 ${
                activeTimeframe === timeframe
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {timeframe}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800 rounded-lg p-6 border border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <stat.icon className="text-indigo-400" size={24} />
              <span
                className={`flex items-center ${
                  stat.positive ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {stat.positive ? (
                  <ArrowUpRight size={20} className="mr-1" />
                ) : (
                  <ArrowDownRight size={20} className="mr-1" />
                )}
                {stat.change}
              </span>
            </div>
            <h3 className="text-gray-400 text-sm mb-1">{stat.title}</h3>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Volume Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-800 rounded-lg p-6 border border-gray-700"
        >
          <h3 className="text-xl font-bold text-indigo-400 mb-6 flex items-center">
            <Activity className="mr-2" size={20} />
            Trading Volume
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={volumeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="date"
                  stroke="#9CA3AF"
                  tick={{ fill: '#9CA3AF' }}
                />
                <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '0.5rem',
                    color: '#F3F4F6'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="volume_quote"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Floor Price Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-800 rounded-lg p-6 border border-gray-700"
        >
          <h3 className="text-xl font-bold text-indigo-400 mb-6 flex items-center">
            <DollarSign className="mr-2" size={20} />
            Floor Price Trends
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={floorPriceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="date"
                  stroke="#9CA3AF"
                  tick={{ fill: '#9CA3AF' }}
                />
                <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '0.5rem',
                    color: '#F3F4F6'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="floor_price_native_quote"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={{ fill: '#8b5cf6', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Distribution Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-lg p-6 border border-gray-700"
        >
          <h3 className="text-xl font-bold text-indigo-400 mb-6 flex items-center">
            <PieChartIcon className="mr-2" size={20} />
            Rarity Distribution
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '0.5rem',
                    color: '#F3F4F6'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center space-x-4 mt-4">
              {distributionData.map((entry, index) => (
                <div key={entry.name} className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm text-gray-400">
                    {entry.name} ({entry.value}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Sales History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-lg p-6 border border-gray-700"
        >
          <h3 className="text-xl font-bold text-indigo-400 mb-6 flex items-center">
            <Search className="mr-2" size={20} />
            Sales History
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={volumeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="date"
                  stroke="#9CA3AF"
                  tick={{ fill: '#9CA3AF' }}
                />
                <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '0.5rem',
                    color: '#F3F4F6'
                  }}
                />
                <Bar dataKey="volume_native_quote" fill="#d946ef" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ChainRegistryDashboard;