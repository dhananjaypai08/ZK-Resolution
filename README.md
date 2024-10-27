# ZK-POC ( Zero knowledge Proof of Location)
- Securing DNS resolution through zero-knowledge geometry - where privacy meets proximity

- Leveraging Telemetry tools in web2 with tokenized domains and verifying them using zkproofs


## Problem Statement
- Traditional DNS resolution systems lack privacy guarantees and geographical awareness, exposing users to potential security vulnerabilities and inefficient routing. Current systems fail to provide verifiable proof of domain ownership while maintaining location privacy, limiting the potential for secure, geography-aware name resolution.
- Annually DNS companies loose on an average of 5 billion$ to DNS attacks
- One DNS attack on an average results in 924k$ loss
- DNS attack results in loss of audience, bad UX and data breaches and phishing
- 68% of the total DNS attacks is DNS Amplification attack which results in Denial of service 

## Brief Overview
ZkResolution is a revolutionary protocol that combines zero-knowledge proofs with Proof of Internet Geometry to create a secure, privacy-preserving DNS resolution system. It implements a novel token-based domain ownership mechanism with cross-chain compatibility between EVM and Cosmos ecosystems.

## Technical Description
The protocol implements a multi-layered architecture:
- Zero-Knowledge Layer: Utilizes ZK proofs for location verification without revealing actual coordinates
- Nexus Layer: Off-chain verification system for proof validation and delay measurements
- Token Layer: Implements SBT-based domain ownership with staking mechanisms
- Cross-Chain Bridge: Facilitates IBC transfers between EVM and Cosmos chains using Zkproofs and IBC
- Monitoring of IBC 

## Working Mechanism

- Domain Registration:
Domain owners stake tokens as collateral
Mint Soul Bound Tokens with embedded location parameters
Define delay time thresholds for verification


- Resolution Process:
Users generate ZK proofs of their location
Nexus layer verifies proofs and performs delay measurements
DNS resolution occurs only when both location and delay criteria are met

- Cross-Chain Operations:
SBT burning on EVM chain
ZK proof generation for transfer verification
IBC protocol handling for cross-chain token movement

## Business Innovation

- Market Differentiation:
First-to-market ZK-based DNS resolution system
Novel implementation of Proof of Internet Geometry
Cross-chain compatibility opening new market segments

- Revenue Streams:
Domain registration fees
Staking rewards
Cross-chain transfer fees
B2B SaaS model for DNS companies 
Domain exchange marketplace with secure proof of Ownership

- Competitive Advantages:
Enhanced privacy features
Geographic optimization
Cross-chain capabilities
Stake-based security model

## Built Using
- Zokrates
- FastAPI
- Solidity
- Spawn
- rollchain
- evmos
- ReactJS

## Contributions 
- Open for contributions! Just fork the repo and create a meaningful PR along and mention the changes in description
