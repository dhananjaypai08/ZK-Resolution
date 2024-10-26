import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadialBarChart, RadialBar, PieChart, Pie, Cell
} from 'recharts';
import { 
  Globe, Server, Coins, GitBranch, Code, Network, Shield, Database,
  ChevronDown, ChevronUp, ExternalLink, AlertCircle, Activity, Users,
  Link, Box, Cpu
} from 'lucide-react';

const MetricCard = ({ title, icon: Icon, children, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-gray-800 p-6 rounded-xl border border-indigo-500/20 ${className}`}
  >
    <div className="flex items-center space-x-3 mb-4">
      <Icon className="text-indigo-500" size={24} />
      <h3 className="text-xl font-semibold">{title}</h3>
    </div>
    {children}
  </motion.div>
);

const ChainRegistryDashboard = () => {
  const [chainRegistry, setChainRegistry] = useState(null);
  const [chainAssets, setChainAssets] = useState(null);
  const [chainInfo, setChainInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const [registryRes, assetsRes, infoRes] = await Promise.all([
        fetch('http://127.0.0.1:1235/chain_registry'),
        fetch('http://127.0.0.1:1235/chain_registry_assets'),
        fetch('http://127.0.0.1:1235/info')
      ]);

      const registryData = await registryRes.json();
      const assetsData = await assetsRes.json();
      const infoData = await infoRes.json();

      setChainRegistry(registryData);
      setChainAssets(assetsData);
      setChainInfo(infoData);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Prepare chain connectivity data
  const connectivityData = chainInfo?.chains?.map(chain => ({
    name: chain.chain_name,
    connections: chain.ibc_paths?.length || 0,
    rpcStatus: chain.rpc_address ? 'Active' : 'Inactive',
    apiStatus: chain.rest_address ? 'Active' : 'Inactive'
  })) || [];

  // Prepare IBC channel status data
  const ibcStatusData = chainInfo?.logs?.ibc_channels?.map(channel => ({
    name: channel.chain_id,
    status: channel.channel.state === 'STATE_OPEN' ? 100 : 0,
    channelId: channel.channel.channel_id
  })) || [];

  // Prepare version compatibility data
  const versionCompatibilityData = [
    { 
      name: 'Cosmos SDK',
      version: chainRegistry?.codebase?.cosmos_sdk_version || '0',
      compatibility: 100
    },
    {
      name: 'IBC',
      version: chainRegistry?.codebase?.ibc_go_version || '0',
      compatibility: 100
    },
    {
      name: 'Tendermint',
      version: chainRegistry?.codebase?.consensus?.version || '0',
      compatibility: 100
    }
  ];

  // Prepare asset metrics
  const assetMetrics = chainAssets?.assets?.map(asset => ({
    name: asset.symbol,
    denom: asset.base,
    exponent: asset.denom_units?.[1]?.exponent || 0,
    hasLogo: asset.logo_URIs ? 100 : 0
  })) || [];

  const COLORS = ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-500 flex items-center space-x-2">
          <AlertCircle />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              {chainRegistry?.pretty_name || 'Chain Registry'} Analytics
            </h1>
            <div className="flex items-center space-x-2 mt-2">
              <span className="px-2 py-1 bg-indigo-500/20 rounded-md text-indigo-400">
                {chainRegistry?.network_type}
              </span>
              <span className="px-2 py-1 bg-green-500/20 rounded-md text-green-400">
                {chainRegistry?.status}
              </span>
              <span className="px-2 py-1 bg-purple-500/20 rounded-md text-purple-400">
                Chain ID: {chainRegistry?.chain_id}
              </span>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-indigo-600 rounded-lg flex items-center space-x-2"
            onClick={() => fetchData()}
          >
            <Activity size={18} />
            <span>Refresh Metrics</span>
          </motion.button>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chain Connectivity Status */}
          <MetricCard title="Chain Connectivity Status" icon={Network}>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={connectivityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                  />
                  <Legend />
                  <Bar dataKey="connections" name="IBC Connections" fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </MetricCard>

          {/* IBC Channel Status */}
          <MetricCard title="IBC Channel Health" icon={Link}>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  innerRadius="30%"
                  outerRadius="80%"
                  data={ibcStatusData}
                  startAngle={180}
                  endAngle={0}
                >
                  <RadialBar
                    minAngle={15}
                    background
                    clockWise={true}
                    dataKey="status"
                    label={{ fill: '#fff', position: 'inside' }}
                  />
                  <Legend />
                  <Tooltip />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-sm text-gray-400">
              Shows channel health status (100% = STATE_OPEN)
            </div>
          </MetricCard>

          {/* Version Compatibility */}
          <MetricCard title="Version Compatibility Matrix" icon={Code}>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={versionCompatibilityData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis type="number" stroke="#9CA3AF" />
                  <YAxis dataKey="name" type="category" stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                  />
                  <Legend />
                  <Bar dataKey="compatibility" name="Version" fill="#10b981">
                    
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </MetricCard>

          {/* Asset Metrics */}
          <MetricCard title="Asset Configuration" icon={Coins}>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={assetMetrics}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="exponent"
                  >
                    {assetMetrics.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </MetricCard>

          {/* Quick Stats */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              className="bg-gray-800 p-6 rounded-xl border border-indigo-500/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Cpu className="text-indigo-500" />
                  <h3 className="text-lg font-medium">Active Validators</h3>
                </div>
                <span className="text-2xl font-bold">{chainInfo?.chains?.[0]?.number_vals || 0}</span>
              </div>
            </motion.div>

            <motion.div
              className="bg-gray-800 p-6 rounded-xl border border-indigo-500/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Box className="text-purple-500" />
                  <h3 className="text-lg font-medium">ICS Protocols</h3>
                </div>
                <span className="text-2xl font-bold">
                  {chainRegistry?.codebase?.ics_enabled?.length || 0}
                </span>
              </div>
            </motion.div>

            <motion.div
              className="bg-gray-800 p-6 rounded-xl border border-indigo-500/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <GitBranch className="text-green-500" />
                  <h3 className="text-lg font-medium">SDK Version</h3>
                </div>
                <span className="text-2xl font-bold">
                  v{chainRegistry?.codebase?.cosmos_sdk_version || '0'}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ChainRegistryDashboard;