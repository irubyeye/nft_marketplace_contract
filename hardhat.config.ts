import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ethers";
import "hardhat-deploy";
import "@typechain/hardhat";

import "@nomicfoundation/hardhat-chai-matchers";
import "hardhat-gas-reporter";
import "solidity-coverage";

import { HardhatUserConfig } from "hardhat/types";

require("dotenv").config();

const INFURA_API_KEY: string = process.env.INFURA_API_KEY || "";
const SEPOLIA_PRIVATE_KEY: string = process.env.SEPOLIA_PRIVATE_KEY || "";
const ALCHEMY_API_KEY: string = process.env.ALCHEMY_API_KEY || "";
const COVERAGE = process.env.COVERAGE === "true";
const ETHERSCAN_API_KEY: string = process.env.ETHERSCAN_API_KEY || "";

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  solidity: {
    compilers: [
      {
        version: "0.8.20",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        },
      },
    ],
  },
  namedAccounts: {
    deployer: { default: 0 },
  },
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [SEPOLIA_PRIVATE_KEY],
    },
    hardhat: {
      chainId: 31337,
      forking: {
        //url: `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
        url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
      },
    },
    localhost: {
      chainId: 31337,
      allowUnlimitedContractSize: true,
    },
  },
};

export default config;
