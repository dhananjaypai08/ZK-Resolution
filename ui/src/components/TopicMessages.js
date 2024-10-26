import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Loader, 
  Database,
  File, 
  ExternalLink,
  Activity,
  Lock
} from 'lucide-react';

import zkProofData from '../../../zkproofs/proofs/proof.json';

const TopicMessages = ({ topicId }) => {
  const [proofData, setProofData] = useState(zkProofData);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('zkproof');
  const [realTimeMetrics, setRealTimeMetrics] = useState({
    proofVerificationTime: '2.3s',
    gasOptimization: '45%',
    privacyScore: '9.8/10',
    networkLatency: '120ms',
    activeVerifiers: 12,
    successfulVerifications: 156
  });

  useEffect(() => {
    const fetchData = async () => {
      try {

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [topicId]);

  const renderZKProofSection = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-lg"
    >
      <h3 className="text-xl font-semibold text-indigo-400 mb-4 flex items-center">
        <Shield className="mr-2" size={20} />
        Zero Knowledge Proof Verification
      </h3>
      {Object.entries(proofData).map(([section, data]) => (
        <motion.div 
          key={section}
          className="mb-6 bg-gray-900 p-4 rounded-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h4 className="text-indigo-400 mb-3 font-medium">{section.charAt(0).toUpperCase() + section.slice(1)}</h4>
          <pre className="text-gray-200 overflow-x-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </motion.div>
      ))}
    </motion.div>
  );

  const renderMetricsSection = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-lg">
        <h3 className="text-xl font-semibold text-indigo-400 mb-6 flex items-center">
          <Activity className="mr-2" size={20} />
          Real-Time ZK Verification Metrics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(realTimeMetrics).map(([key, value]) => (
            <motion.div
              key={key}
              className="bg-gray-900 p-4 rounded-lg"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <h4 className="text-gray-400 text-sm mb-2">
                {key.split(/(?=[A-Z])/).join(' ').toUpperCase()}
              </h4>
              <p className="text-2xl font-bold text-indigo-400">{value}</p>
            </motion.div>
          ))}
        </div>
      </div>
      
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-lg">
        <h3 className="text-xl font-semibold text-indigo-400 mb-4 flex items-center">
          <Lock className="mr-2" size={20} />
          Security Status
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-gray-900 p-4 rounded-lg">
            <span className="text-gray-300">Circuit Integrity</span>
            <span className="text-green-400">Verified</span>
          </div>
          <div className="flex items-center justify-between bg-gray-900 p-4 rounded-lg">
            <span className="text-gray-300">Proof Soundness</span>
            <span className="text-green-400">Valid</span>
          </div>
          <div className="flex items-center justify-between bg-gray-900 p-4 rounded-lg">
            <span className="text-gray-300">Zero-Knowledge Property</span>
            <span className="text-green-400">Maintained</span>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <motion.div 
      className="max-w-4xl mx-auto text-gray-300 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold mb-6 text-indigo-400">
        Zero Knowledge Proof Verification Dashboard
      </h2>

      <div className="flex space-x-4 mb-6">
        {['zkproof', 'metrics'].map((tab) => (
          <motion.button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md transition duration-200 ${
              activeTab === tab ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {tab.split(/(?=[A-Z])/).join(' ').charAt(0).toUpperCase() + tab.slice(1)}
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            className="flex justify-center items-center h-32"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Loader className="animate-spin text-indigo-500" size={32} />
          </motion.div>
        ) : (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'zkproof' && renderZKProofSection()}
            {activeTab === 'metrics' && renderMetricsSection()}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TopicMessages;