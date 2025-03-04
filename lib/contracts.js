import { ethers } from "ethers";
import SPORTS_AMMV2_ABI from "./sportsAMMV2ContractAbi";

// Replace with the correct contract addresses for Optimism (or your selected network)
export const SPORTS_AMM_V2_CONTRACT_ADDRESS = "0xFb4e4811C7A811E098A556bd79B64c20b479E431"; // Confirmed Thales AMM V2 contract
export const USDC_ADDRESS = "0x7F5c764cBc14f9669B88837ca1490cCa17c31607"; // Official USDC contract address on Optimism

/**
 * Get the SportsAMM contract instance
 * @param {Object} provider - The Web3 provider
 */
export function getSportsAmmContract(provider) {
    if (!provider || typeof provider.getSigner !== "function") {
        throw new Error("Invalid provider: Signer not available");
    }

    return new ethers.Contract(
        SPORTS_AMM_V2_CONTRACT_ADDRESS,
        SPORTS_AMMV2_ABI,
        provider.getSigner()
    );
}

/**
 * Get the USDC contract instance
 * @param {Object} provider - The Web3 provider
 */
export function getUSDCContract(provider) {
    if (!provider || typeof provider.getSigner !== "function") {
        throw new Error("Invalid provider: Signer not available");
    }

    return new ethers.Contract(
        USDC_ADDRESS,
        [
            "function approve(address spender, uint256 amount) public returns (bool)",
            "function allowance(address owner, address spender) public view returns (uint256)",
            "function balanceOf(address account) public view returns (uint256)",
            "function transfer(address recipient, uint256 amount) public returns (bool)"
        ],
        provider.getSigner()
    );
}
