import { ethers } from "ethers";
import SPORTS_AMMV2_ABI from "./sportsAMMV2ContractAbi";

export const SPORTS_AMM_V2_CONTRACT_ADDRESS = "0xFb4e4811C7A811E098A556bd79B64c20b479E431"; // Your actual contract address
export const USDC_ADDRESS = "0xYourUSDCContractAddress"; // Replace with actual USDC contract address

/**
 * Get the SportsAMM contract instance
 * @param {Object} provider - The Web3 provider
 */
export function getSportsAmmContract(provider) {
    return new ethers.Contract(SPORTS_AMM_V2_CONTRACT_ADDRESS, SPORTS_AMMV2_ABI, provider.getSigner());
}

/**
 * Get the USDC contract instance
 * @param {Object} provider - The Web3 provider
 */
export function getUSDCContract(provider) {
    return new ethers.Contract(USDC_ADDRESS, [
        "function approve(address spender, uint256 amount) public returns (bool)",
        "function allowance(address owner, address spender) public view returns (uint256)",
    ], provider.getSigner());
}
