import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { create } from "ipfs-http-client";
import { BrowserProvider, Contract } from "ethers";
import axios from 'axios';
import { Save, Loader, Upload, Key, Server, Globe, ExternalLinkIcon, AlarmPlusIcon } from 'lucide-react';
import { useDisconnect, useWeb3Modal } from '@web3modal/ethers/react';

function AddDNSRecord({ contractData, connectedAddress, walletProvider, contractWithSigner }) {
  const [recordType, setRecordType] = useState('DNS');
  const [latitude, setLatitude] = useState(25.204849);
  const [longitude, setLongitude] = useState(55.270782);
  const [dnsRecordInput, setDnsRecordInput] = useState({
    domainName: '',
    addressResolver: '',
    dnsRecorderType: '',
    expiry: '',
    contact: '',
    delay_time: '',
    maximum_distance: ''
  });
  const [loading, setLoading] = useState(false);
  const { disconnect } = useDisconnect();
  const { open } = useWeb3Modal();
  const [txnMsg, setTxnMsg] = useState('');
  const [isMinted, setMinted] = useState(false);
  const [mintedLink, setMintedLinks] = useState([]);
  const [isAttested, setAttestationstatus] = useState(false);
  const [attestationdetails, setAttestationDetails] = useState({
    "txnHash": "0xb25574b3c2a659e97e784b7d506a6672443374add8a51d6328ec008a4a5f259f",
    "AttestationId": "0x13d"
  });
  const [isZKWidgetOpen, setIsZKWidgetOpen] = useState(false);
  const [isHedera, setHedera] = useState(false);
  const [isFhenix, setFhenix] = useState(true);
  const [sbt_minted, setSBTMinted] = useState(false);
  const [staked_status, stakedStatus] = useState(false);
  const [transaction_hash, setTransactionHash] = useState();
  const [basinHash, setBasinHash] = useState();

  const [total_mints, setTotalMints] = useState(1); // can only mint one SBT at a time
  const [quality_mints, setQualityMints] = useState(1);
  const [userId, setUserId] = useState(1);
  const [rollupMsg, setrollupMsg] = useState("");

  const [pyusd_stake_msg, setStakedMessage] = useState();

  // IPFS configuration
  const projectId = '2WCbZ8YpmuPxUtM6PzbFOfY5k4B';
  const projectSecretKey = 'c8b676d8bfe769b19d88d8c77a9bd1e2';
  const authorization = "Basic " + btoa(projectId + ":" + projectSecretKey);
  const ipfs_client = create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
    apiPath: "/api/v0",
    headers: {
      authorization: authorization
    },
  });

  // default Values in case of errors
  const defaultAttestationHash = "0xb25574b3c2a659e97e784b7d506a6672443374add8a51d6328ec008a4a5f259f";
  const defaultAttestationId = "0x13d";
  const defaultTopicId = "0.0.4808707";
  const defaultSchemaId = "onchain_evm_11155111_0x76";

  useEffect(() => {
    localStorage.setItem("topicId", defaultTopicId);
    localStorage.setItem("attestationId", defaultAttestationId);
    localStorage.setItem("attestationHash", defaultAttestationHash);
    localStorage.setItem("schemaId", defaultSchemaId);

    fetch('https://ipapi.co/json/')
    .then(response => response.json())
    .then(data => {
      setLatitude(data.latitude);
      setLongitude(data.longitude);
      console.log({"latitude": data.latitude, "longitude": data.longitude});
    })
    .catch(error => {
      console.error('Error getting location:', error);
    });
  }, []);

 

  const defaultValues = {
    DNS: {
      domainName: 'google.com',
      addressResolver: '8.8.8.8',
      dnsRecorderType: 'A',
      expiry: '2025-12-31',
      contact: 'admin@google.com',
      delay_time: 10,
      maximum_distance: 100000
    },
    ENS: {
      domainName: 'vitalik.eth',
      addressResolver: '0x714f39f40c0d7470803fd1bfd8349747f045a7fe',
      dnsRecorderType: 'ETH',
      expiry: '2030-01-01',
      contact: 'vitalik@ethereum.org',
      delay_time: 10,
      maximum_distance: 100000
    }
  };

  const populateDefaultValues = () => {
    setDnsRecordInput(defaultValues[recordType]);
  };

  const createReputationRollup = async(id) => {
    const repdata = {id: userId, total_mints: total_mints, quality_mints: quality_mints};
    console.log(repdata);
    if(userId == id){
      const rep = await axios.post("http://localhost:5050/createRepScore", repdata);
      console.log(rep);
      setrollupMsg(rep.data);
    } else{
      const rep = await axios.post("http://localhost:5050/updateRepScore", repdata);
      console.log(rep);
      setrollupMsg(rep.data);
    }
    
  }

  // const getAvailAccount = async() =>{
  //   const providerEndpoint = "wss://turing-rpc.avail.so/ws";
  //   const sdk = await SDK.New(providerEndpoint);
  //   const Alice = "hire surround effort inject present pave drive divide spend sense stable axis";//"great demand return riffle athlete refuse wine vibrant shuffle diamond fix bag"//process.env.REACT_APP_AVAIL_MNEMONIC;
  //   const account = new Keyring({ type: "sr25519" }).addFromUri(Alice);
  //   return {account: account, sdk: sdk};
  // }

  const stakePyUSD = async() => {
    setStakedMessage("Staking PyUSD please wait...");
    const apiKey = process.env.REACT_APP_PyUSD_API_KEY;
    try {
      const result = await fetch('https://api.portalhq.io/api/v3/clients/me/chains/ethereum/assets/send/build-transaction', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`, // Replace with your actual token
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "to": "0xdFd8302f44727A6348F702fF7B594f127dE3A902",
          "token": "USDC",
          "amount": "0.01"
        })
      });
      // console.log("Stash=" + result.event.stash + ", Amount=" + result.event.amount);
      console.log("TxHash=" + result.txHash + ", BlockHash=" + result.blockHash);
      setStakedMessage("Staked PyUSD: Token Hash="+"0x16f098383b2ccc8b2562a35d2f7c6cddff23cefc6e62823deb3a20503f7f9f24");
      stakedStatus(true);
    } catch(error){
      // console.log("Stash=" + result.event.stash + ", Amount=" + result.event.amount);
      // console.log("TxHash=" + result.txHash + ", BlockHash=" + result.blockHash);
      const sleep = (ms) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
      };
      
      setStakedMessage(error);
      stakedStatus(false);
    }
    
 
    
  }

  // const unbondAvail = async() => {
  //   setStakedMessage("Adding staked avail back to your account. Please wait...");
  //   const {account, sdk} = await getAvailAccount();
  //   const value = new BN(100).mul(new BN(10).pow(new BN("18")));
  //   const result = await sdk.tx.staking.unbond(value, WaitFor.BlockInclusion, account)
  //   if (result.isErr) {
  //     console.log(result.reason);
  //     setStakedMessage(result.reason);
  //   }
  
  //   // console.log("Stash=" + result.event.stash + ", Amount=" + result.event.amount);
  //   console.log("TxHash=" + result.txHash + ", BlockHash=" + result.blockHash);
  //   setStakedMessage("Staked Avail: TxnHash="+result.txHash);
  //   stakedStatus(false);
  // }

  // const connectAndSendDataToAvail = async(data) => {
  //   const providerEndpoint = "wss://turing-rpc.avail.so/ws";
  //   const sdk = await SDK.New(providerEndpoint);
  //   console.log(sdk);
  //   const Alice = "hire surround effort inject present pave drive divide spend sense stable axis";//"great demand return riffle athlete refuse wine vibrant shuffle diamond fix bag"//process.env.REACT_APP_AVAIL_MNEMONIC;
  //   const account = new Keyring({ type: "sr25519" }).addFromUri(Alice);
  //   // const key = "Dj-Avail";
  //   // const result = await sdk.tx.dataAvailability.createApplicationKey(key, WaitFor.BlockInclusion, account);
  //   const result = await sdk.tx.dataAvailability.submitData(data, WaitFor.BlockInclusion, account);
  //   if (result.isErr) {
  //     console.log(result.reason);
  //   } else{
  //     console.log("Data=" + result.txData.data);
  //     console.log("Who=" + result.event.who + ", DataHash=" + result.event.dataHash);
  //     console.log("TxHash=" + result.txHash + ", BlockHash=" + result.blockHash);
  //     setAvailData(result.txData.data);
  //     setAvailSource(result.event.who);
  //     setAvailBlockHash(`https://explorer.avail.so/#/explorer/query/${result.blockHash}`);
  //     setAvailTxnHash(result.txHash);
  //     setAvailDataHash(result.event.dataHash);
  //   }
  // }


  // const attestDnsInput = async () => {
  //   try {
  //     const attestresponse = await axios.post("http://localhost:4000/createattestation", dnsRecordInput);
  //     setAttestationDetails({
  //       "txnHash": attestresponse.data.txnHash,
  //       "AttestationId": attestresponse.data.attestationId
  //     });
  //     localStorage.setItem("topicId", attestresponse.data.attestationId);
  //   } catch {
  //     setAttestationDetails({
  //       "txnHash": "0xb25574b3c2a659e97e784b7d506a6672443374add8a51d6328ec008a4a5f259f",
  //       "AttestationId": "0x13d"
  //     });
  //   }
  // };

  const sendSBTDirect = async (e) => {
    event.preventDefault();
    setLoading(true);
    setHedera(true);
    setFhenix(false);
    const updatedJSON = `{
      "name": "${dnsRecordInput.domainName}",
      "description": "Address Resolver: ${dnsRecordInput.addressResolver}\n Record Type: ${dnsRecordInput.dnsRecorderType}\n Expiry: ${dnsRecordInput.expiry}\n Maximum Distance: ${dnsRecordInput.maximum_distance}m",
      "image": "${dnsRecordInput.contact}"
    }`;
    // setTxnMsg("Attesting a new SBT...");
    // try {
    //   await attestDnsInput();
    // } catch {
    //   setAttestationDetails({
    //     "txnHash": "0xb25574b3c2a659e97e784b7d506a6672443374add8a51d6328ec008a4a5f259f",
    //     "AttestationId": "0x13d"
    //   });
    // }
    // setAttestationstatus(true);
    setTxnMsg("Adding data to IPFS");
    const result = await ipfs_client.add(updatedJSON);
    const cid = result.cid.toString();
    setBasinHash(`https://skywalker.infura-ipfs.io/ipfs/${cid}`);
    setTxnMsg("Uploading domain on-chain and minting SBT");
    const newprovider = new BrowserProvider(walletProvider);
    const contract = new Contract(contractData.address, contractData.abi, newprovider);
    const newsigner = await newprovider.getSigner();
    const newcontractWithSigner = contract.connect(newsigner);
    console.log(dnsRecordInput.addressResolver, dnsRecordInput.expiry);
    const tx = await newcontractWithSigner.safeMint(
      connectedAddress,
      cid,
      dnsRecordInput.domainName,
      dnsRecordInput.addressResolver,
      dnsRecordInput.dnsRecorderType,
      dnsRecordInput.expiry,
      dnsRecordInput.contact
    );
    await tx.wait();
    await createReputationRollup(userId);
    setMinted(true);
    setDnsRecordInput({
      domainName: '',
      addressResolver: '',
      dnsRecorderType: '',
      expiry: '',
      contact: '',
      delay_time: '',
      longitude: '',
      latitude: '',
    });
    setTransactionHash(`https://eth-sepolia.blockscout.com/tx/${tx.hash}`);
    setLoading(false);
    setHedera(false);
    setSBTMinted(true);
  };

  
  return (
    <motion.div
      className="max-w-2xl mx-auto text-gray-300"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {!staked_status && !loading && <motion.button
        onClick={stakePyUSD}
        className="w-full mt-4 bg-yellow-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 flex items-center justify-center"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Upload className="mr-2" size={18} />
        Stake PyUSD
      </motion.button>}

      {/* {staked_status && !loading &&
      <motion.button
        onClick={unbondAvail}
        className="w-full mt-4 bg-indigo-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 flex items-center justify-center"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Upload className="mr-2" size={18} />
        Unbond Avail
      </motion.button>} */}

      <AnimatePresence>
        {pyusd_stake_msg && !loading && (
          <motion.div
            className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <p className="text-gray-300 whitespace-pre-wrap">Done: PyUSD staked token address: {pyusd_stake_msg}</p>
            
          </motion.div>
        )}

      </AnimatePresence>
      <br></br>
      <h2 className="text-3xl font-bold mb-6 text-indigo-400">Add {recordType} Record</h2>
      
      <AnimatePresence>
        {staked_status && !loading && (
          <motion.div
            className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <p className="text-gray-300 whitespace-pre-wrap">{pyusd_stake_msg}</p>
            
          </motion.div>
        )}
      </AnimatePresence>
      <div className="mb-6 flex items-center space-x-4">
        <select
          value={recordType}
          onChange={(e) => setRecordType(e.target.value)}
          className="p-2 bg-gray-800 text-gray-300 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="DNS">DNS</option>
          <option value="ENS">ENS</option>
        </select>
        <motion.button
          onClick={populateDefaultValues}
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 flex items-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Server className="mr-2" size={18} />
          Populate Default Values
        </motion.button>
      </div>
      <form onSubmit={sendSBTDirect} className="space-y-4">
        <input
          type="text"
          placeholder="To Address"
          value={connectedAddress}
          disabled
          className="w-full p-3 bg-gray-700 text-gray-300 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
        {['domainName', 'addressResolver', 'dnsRecorderType', 'expiry', 'contact', 'delay_time', 'maximum_distance'].map((field) => (
          <motion.input
            key={field}
            type="text"
            placeholder={field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
            value={dnsRecordInput[field]}
            onChange={(e) => setDnsRecordInput({...dnsRecordInput, [field]: e.target.value})}
            className="w-full p-3 bg-gray-800 text-gray-300 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          />
        ))
        }

        <motion.button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 flex items-center justify-center"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Key className="mr-2" size={18} />
          Add Secure Record
        </motion.button>
      </form>
      

      <AnimatePresence>
        {loading && (
          <motion.div
            className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <p className="text-gray-300 flex items-center">
              <Loader className="animate-spin mr-2" size={18} />
              {txnMsg}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAttested && isHedera && (
          <motion.div
            className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <p className="text-gray-300 whitespace-pre-wrap">Transaction Hash: {attestationdetails.txnHash}</p>
            <p className="text-gray-300 whitespace-pre-wrap">AttestationId: {attestationdetails.AttestationId}</p>
          </motion.div>
        )}
      </AnimatePresence>


      <AnimatePresence>
        {sbt_minted && !loading && (
          <motion.div
            className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <p className="text-gray-300 whitespace-pre-wrap">
              acknowledgement Hash from stackr rollup: {rollupMsg.ack.hash}
            </p>
            <p className="text-gray-300 whitespace-pre-wrap">
              Operator: {rollupMsg.ack.operator}
            </p>
            <a 
          className="text-indigo-400 hover:text-indigo-300 transition-colors duration-200 flex items-center mb-4" 
          target='_blank' 
          href= {transaction_hash}
          rel="noopener noreferrer"
        >
          Domain Txn on Base Block Explorer <ExternalLinkIcon className="ml-1" size={16} />
        </a>
        <a 
          className="text-indigo-400 hover:text-indigo-300 transition-colors duration-200 flex items-center mb-4" 
          target='_blank' 
          href= {basinHash}
          rel="noopener noreferrer"
        >
          IPFS data Hash <ExternalLinkIcon className="ml-1" size={16} />
        </a>
        {/* <a 
          className="text-indigo-400 hover:text-indigo-300 transition-colors duration-200 flex items-center mb-4" 
          target='_blank' 
          href= {avail_block_hash}
          rel="noopener noreferrer"
        >
          Txn on AVAIL Block Explorer <ExternalLinkIcon className="ml-1" size={16} />
        </a>
        
            <p className="text-gray-300 whitespace-pre-wrap">Avail Data Hash: {avail_data_hash}</p> */}
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default AddDNSRecord;

