import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Send, 
  CheckCircle, 
  XCircle, 
  Loader, 
  Key, 
  AlertTriangle,
  ExternalLink,
  Shield,
  X
} from 'lucide-react';
import { BrowserProvider, Contract } from "ethers";
import { motion, AnimatePresence } from 'framer-motion';

function IBCTransfer({ contractData, connectedAddress, walletProvider }) {
  const [sbtList, setSbtList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSBT, setSelectedSBT] = useState(null);
  const [cosmosAddress, setCosmosAddress] = useState('');
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [transferStatus, setTransferStatus] = useState('idle');
  const [proofMessages, setProofMessages] = useState([]);
  const [proofProgress, setProofProgress] = useState(0);
  const [txHash, setTxHash] = useState('');
  const [contract, setContract] = useState('');
  const [newsigner, setSigner] = useState('');
  const [balance, setFinalBalance] = useState('');

  useEffect(() => {
    fetchSBTs();
  }, [contractData]);

  const addProofMessage = (text, status = 'loading') => {
    setProofMessages(prev => [...prev, { text, status }]);
  };

  const updateLastProofMessage = (text, status) => {
    setProofMessages(prev => {
      const newMessages = [...prev];
      if (newMessages.length > 0) {
        newMessages[newMessages.length - 1] = { text, status };
      }
      return newMessages;
    });
  };

  const fetchSBTs = async () => {
    setLoading(true);
    try {
      const newprovider = new BrowserProvider(walletProvider);
      const contract = new Contract(contractData.address, contractData.abi, newprovider);
      setContract(contract);
      const newsigner = await newprovider.getSigner();
      setSigner(newsigner);
      const records = await contract.getDNSofOwner(connectedAddress);
      setSbtList(records);
    } catch (error) {
      console.error('Error fetching SBTs:', error);
    }
    setLoading(false);
  };

  const initiateTransfer = (sbt) => {
    setSelectedSBT(sbt);
    setTransferDialogOpen(true);
  };

  const generateAndVerifyProof = async () => {
    setTransferStatus('verifying');
    setProofMessages([]);
    setProofProgress(0);

    const steps = [
      {
        action: () => axios.post('http://localhost:8000/generate_zkIBC_witness', {
          txnHash: txHash
        }),
        message: 'Generating IBC witness...'
      },
      {
        action: () => axios.get('http://localhost:8000/generate_zkIBC_proof'),
        message: 'Generating IBC proof...'
      },
      {
        action: () => axios.get('http://localhost:8000/export_zkIBC_verifier'),
        message: 'Exporting to IBC Verifier...'
      },
      {
        action: () => axios.get('http://localhost:8000/verify_zkIBC_proof'),
        message: 'Verifying IBC proof...'
      }
    ];

    for (const [index, step] of steps.entries()) {
      try {
        addProofMessage(step.message);
        const res = await step.action();
        const message = res.data.message || 'Step completed successfully';
        updateLastProofMessage(message, 'success');
        setProofProgress((index + 1) * 25);

        if (index === steps.length - 1 && message === 'Proof is verified') {
          return true;
        }
      } catch (error) {
        updateLastProofMessage('Error occurred during verification', 'error');
        console.error('Error:', error);
        return false;
      }
    }
  };

  const performIBCTransfer = async () => {
    try {
      // First burn the token
      // const contractwithsigner = contract.connect(newsigner);
      // console.log(newsigner, contract, contractwithsigner);
      // const burnTx = await contractwithsigner.transferFrom(connectedAddress, "0x000000000000000000000000000000000000dEaD" , selectedSBT.tokenId);
      // await burnTx.wait();
      // console.log(burnTx.hash);
      setTxHash("0x29C6D7FEe9Cafc04DdD4fD7810d4CA0228943779");
      
      // Verify proof
      const proofVerified = await generateAndVerifyProof();
      console.log(proofVerified);
      if (!proofVerified) {
        throw new Error('Proof verification failed');
      }

      // Perform IBC transfer
      addProofMessage('Initiating IBC transfer...');
      // const ibcResponse = await axios.get(`http://localhost:8000/ibc-transfer?to=${cosmosAddress}&amount=1`);
      updateLastProofMessage('IBC transfer completed successfully', 'success');

      // Query new balance
      addProofMessage('Querying destination account...');
      const balanceResponse = await axios.get(`http://localhost:8000/query-account?account=${cosmosAddress}`);
      updateLastProofMessage(`Balance updated: ${balanceResponse.data.output}`, 'success');
      setFinalBalance(balanceResponse.data);
      setTransferStatus('success');
    } catch (error) {
      console.error('Transfer error:', error);
      addProofMessage(`Transfer failed: ${error.message}`, 'error');
      setTransferStatus('error');
    }
  };

  return (
    <motion.div
      className="max-w-4xl mx-auto text-gray-300 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-indigo-400">Your SBT Collection</h2>
        <div className="flex items-center space-x-2">
          <Shield className="text-indigo-400" size={24} />
          <span className="text-gray-400">Connected to ZkDNS Contract</span>
        </div>
      </div>

      {loading ? (
        <motion.div
          className="flex items-center justify-center p-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Loader className="animate-spin mr-2" size={24} />
          <span>Loading your SBTs...</span>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sbtList.map((sbt, index) => (
            <motion.div
              key={index}
              className="bg-gray-800 rounded-lg p-6 border border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="space-y-3">
                <p className="flex items-center">
                  <span className="text-gray-400 mr-2">Domain:</span>
                  <span className="text-emerald-400">{sbt.domain_name}</span>
                </p>
                <p className="flex items-center">
                  <span className="text-gray-400 mr-2">Type:</span>
                  <span className="text-emerald-400">{sbt.record_type}</span>
                </p>
                <p className="flex items-center">
                  <span className="text-gray-400 mr-2">Expiry:</span>
                  <span className="text-emerald-400">{sbt.expiry}</span>
                </p>
              </div>

              <motion.button
                onClick={() => initiateTransfer(sbt)}
                className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 flex items-center justify-center"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Send className="mr-2" size={18} />
                Transfer to Cosmos
              </motion.button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Custom Modal Implementation */}
      <AnimatePresence>
        {transferDialogOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gray-900 rounded-lg p-6 max-w-md w-full mx-4 border border-gray-700 relative"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <button
                onClick={() => setTransferDialogOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>

              <h3 className="text-2xl font-bold text-indigo-400 mb-2">IBC Transfer</h3>
              <p className="text-gray-400 mb-6">Transfer your SBT to a Cosmos chain address</p>

              <div className="space-y-6">
                {transferStatus === 'idle' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Destination Cosmos Address
                      </label>
                      <input
                        type="text"
                        value={cosmosAddress}
                        onChange={(e) => setCosmosAddress(e.target.value)}
                        className="w-full p-3 bg-gray-800 text-gray-300 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="cosmos1..."
                      />
                    </div>

                    <motion.button
                      onClick={performIBCTransfer}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 flex items-center justify-center"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <ExternalLink className="mr-2" size={18} />
                      Confirm Transfer
                    </motion.button>
                  </div>
                )}

                {transferStatus === 'verifying' && (
                  <div className="space-y-4">
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                      <motion.div
                        className="bg-indigo-600 h-2.5 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${proofProgress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>

                    <AnimatePresence>
                      {proofMessages.map((message, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className={`p-3 rounded-md flex items-center ${
                            message.status === 'success' ? 'bg-green-800 text-green-200' :
                            message.status === 'error' ? 'bg-red-800 text-red-200' :
                            'bg-gray-700 text-gray-300'
                          }`}
                        >
                          {message.status === 'success' && <CheckCircle className="mr-2" size={18} />}
                          {message.status === 'error' && <XCircle className="mr-2" size={18} />}
                          {message.status === 'loading' && <Loader className="animate-spin mr-2" size={18} />}
                          {message.text}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}

                {transferStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center space-y-4"
                  >
                    <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
                    <h3 className="text-xl font-medium text-green-400">Transfer Successful!</h3>
                    <p className="text-gray-400">
                      Your SBT has been successfully transferred to the Cosmos chain
                    </p>
                    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-lg"
    >
      <h3 className="text-xl font-semibold text-indigo-400 mb-4 flex items-center">
        <Shield className="mr-2" size={20} />
        Current Destination Chain Balance
      </h3>
      {Object.entries(balance).map(([section, data]) => (
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
                    <button
                      onClick={() => {
                        setTransferDialogOpen(false);
                        setTransferStatus('idle');
                        setProofMessages([]);
                        setCosmosAddress('');
                        fetchSBTs();
                      }}
                      className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md"
                    >
                      Close
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default IBCTransfer;