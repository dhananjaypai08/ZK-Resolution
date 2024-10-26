import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { SigningStargateClient } from "@cosmjs/stargate";
import Sidebar from '../components/Sidebar';
import Landing from './Landing';
import AddDNSRecord from '../components/AddDNSRecord';
import SearchDNSRecord from '../components/SearchDNSRecord';
import TopicMessages from '../components/TopicMessages';
import SSVMetrics from '../components/SSVMetrics';
import EnvioMetrics from '../components/EnvioHypersyncDashboard';
// import abiFhenix from "../contracts/ZKDNSFhenix.json";
import abiHedera from "../contracts/ZKDNS.json";
import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react';
import { useWeb3ModalProvider, useWeb3ModalAccount, useDisconnect, useWeb3Modal } from '@web3modal/ethers/react';

// Web3Modal configuration
const projectId = 'a7a2557c75d9558a9c932d5f99559799';

// Chain configurations
const evmosTestnet = {
  chainId: 9000,
  name: 'Evmos Testnet',
  currency: 'tEVMOS',
  explorerUrl: 'https://testnet.escan.live',
  rpcUrl: 'https://9000.rpc.thirdweb.com/'
};

const testnet1 = {
  chainId: 296,
  name: 'Hedera Testnetwork',
  currency: 'HBAR',
  rpcUrl: 'https://testnet.hashio.io/api'
};

// Keplr Evmos testnet chain info
const evmosTestnetInfo = {
  chainId: "evmos_9000-4",
  chainName: "Evmos Testnet",
  rpc: "https://evmos-testnet-rpc.polkachu.com",
  rest: "https://evmos-testnet-api.polkachu.com",
  bip44: {
    coinType: 60
  },
  bech32Config: {
    bech32PrefixAccAddr: "evmos",
    bech32PrefixAccPub: "evmospub",
    bech32PrefixValAddr: "evmosvaloper",
    bech32PrefixValPub: "evmosvaloperpub",
    bech32PrefixConsAddr: "evmosvalcons",
    bech32PrefixConsPub: "evmosvalconspub"
  },
  currencies: [
    {
      coinDenom: "tEVMOS",
      coinMinimalDenom: "atevmos",
      coinDecimals: 18
    }
  ],
  feeCurrencies: [
    {
      coinDenom: "tEVMOS",
      coinMinimalDenom: "atevmos",
      coinDecimals: 18
    }
  ],
  stakeCurrency: {
    coinDenom: "tEVMOS",
    coinMinimalDenom: "atevmos",
    coinDecimals: 18
  },
  gasPriceStep: {
    low: 25000000000,
    average: 25000000000,
    high: 40000000000
  }
};

const metadata = {
  name: 'ZkDNS',
  description: 'Private and secure DNS/ENS Lookups',
  url: 'https://ZkDNS.com',
  icons: ['https://example.com/icon.png']
};

const ethersConfig = defaultConfig({
  metadata,
  defaultChainId: 8008135,
  auth: {
    email: true,
    socials: ['google', 'x', 'github', 'discord', 'apple', 'facebook', 'farcaster'],
    showWallets: true,
    walletFeatures: true
  }
});

createWeb3Modal({
  ethersConfig,
  chains: [evmosTestnet, testnet1],
  projectId,
  enableAnalytics: true,
  themeMode: 'dark'
});

function Home() {
  const [activeTab, setActiveTab] = useState('home');
  const [loading, setLoading] = useState(false);
  const [contract, setContract] = useState();
  const [contractWithSigner, setContractWithSigner] = useState();
  const [contractData, setContractData] = useState();
  const [keplrConnected, setKeplrConnected] = useState(false);
  const [keplrAddress, setKeplrAddress] = useState('');

  const { walletProvider } = useWeb3ModalProvider();
  const { address, isConnected } = useWeb3ModalAccount();
  const { disconnect } = useDisconnect();
  const { open } = useWeb3Modal();

  const defaultAttestationHash = "0xb25574b3c2a659e97e784b7d506a6672443374add8a51d6328ec008a4a5f259f";
  const defaultAttestationId = "0x13d";
  const defaultTopicId = "0.0.4808707";
  const defaultSchemaId = "onchain_evm_11155111_0x76";

  useEffect(() => {
    localStorage.setItem("topicId", defaultTopicId);
    localStorage.setItem("attestationId", defaultAttestationId);
    localStorage.setItem("attestationHash", defaultAttestationHash);
    localStorage.setItem("schemaId", defaultSchemaId);
  }, []);

  useEffect(() => {
    const setupContract = async () => {
      if (isConnected && walletProvider) {
        setLoading(true);
        try {
          const ethersProvider = new ethers.BrowserProvider(walletProvider);
          const network = await ethersProvider.getNetwork();
          
          let abi= abiHedera;

          const signer = await ethersProvider.getSigner();
          const contract = new ethers.Contract(abi.address, abi.abi, ethersProvider);
          const contractWithSigner = contract.connect(signer);
          setContract(contract);
          setContractData(abi);
          setContractWithSigner(contractWithSigner);

          let owner = await contract.owner();
          console.log("Contract owner:", owner);
        } catch (error) {
          console.error("Error setting up contract:", error);
        }
        setLoading(false);
      }
    };

    setupContract();
  }, [isConnected, walletProvider]);

  const connectKeplr = async () => {
    if (!window.keplr) {
      alert("Please install Keplr extension");
      return;
    }

    try {
      // Suggest the testnet chain to Keplr
      await window.keplr.experimentalSuggestChain(evmosTestnetInfo);
      
      // Enable access to Evmos testnet
      await window.keplr.enable(evmosTestnetInfo.chainId);

      // Get the offline signer for signing transactions
      const offlineSigner = await window.keplr.getOfflineSigner(evmosTestnetInfo.chainId);
      
      // Get user's account
      const accounts = await offlineSigner.getAccounts();
      const userAddress = accounts[0].address;
      
      // Create signing client
      const client = await SigningStargateClient.connectWithSigner(
        evmosTestnetInfo.rpc,
        offlineSigner
      );

      setKeplrConnected(true);
      setKeplrAddress(userAddress);
      
      console.log("Connected to Keplr with address:", userAddress);
      console.log("Client:", client);

    } catch (error) {
      console.error("Error connecting to Keplr:", error);
      alert("Failed to connect to Keplr: " + error.message);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-100">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 p-8">
        <div className="flex flex-col gap-4">
          <w3m-button />
          
          <button
            type="button"
            className="w-1/2 max-w-sm bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 flex items-center justify-center"
            onClick={connectKeplr}
          >
            {keplrConnected ? 'Connected to Keplr' : 'Keplr Wallet'}
          </button>

          {keplrConnected && (
            <p className="text-gray-400">
              Keplr Address: <span className="font-mono text-purple-400">{keplrAddress}</span>
            </p>
          )}
        </div>

        {isConnected && (
          <p className="my-8 text-gray-400">
            Web3Modal Address: <span className="font-mono text-indigo-400">{address}</span>
          </p>
        )}

        {activeTab === 'home' && <Landing />}
        {activeTab === 'add' && <AddDNSRecord contractData={contractData} connectedAddress={address} walletProvider={walletProvider} />}
        {activeTab === 'search' && <SearchDNSRecord contract={contract}/>}
        {activeTab === 'topicmessages' && <TopicMessages topicId="0.0.4790189" />}
        {activeTab === 'ssvmetrics' && <SSVMetrics />}
        {activeTab === 'enviometrics' && <EnvioMetrics />}

        {loading && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;