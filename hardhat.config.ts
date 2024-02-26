import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require("dotenv").config({ path: ".env" });

const MAINNET_RPC_URL = process.env.MAINNET_RPC_URL;

// const PRIVATE_KEY = process.env.PRIVATE_KEY;

module.exports = {
  solidity: "0.8.24",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      forking: {
        url: MAINNET_RPC_URL,
      },
      chainId: 1,
    },
    // sepolia: {
    //   url: SEPOLIA_RPC_URL,
    //   accounts: [PRIVATE_KEY],
    //   chainId: 11155111,
    // },
    // mumbai: {
    //   url: ALCHEMY_MUMBAI_API_KEY_URL,
    //   accounts: [ACCOUNT_PRIVATE_KEY],
    // },
  },
  lockGasLimit: 200000000000,
  gasPrice: 10000000000,
};