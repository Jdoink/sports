import { ethers } from "ethers";
import sportsAMMV2ContractAbi from "./sportsAMMV2ContractAbi.js"; // Make sure this file exists

const SPORTS_AMM_V2_CONTRACT_ADDRESS = "0xFb4e4811C7A811E098A556bD79B64c20b479E431"; // Sports AMM V2 contract
const COLLATERAL_USDC = "0x7F5c764cBc14f9669B88837ca1490cCa17c31607"; // USDC on Optimism
const COLLATERAL_ETH = ethers.constants.AddressZero; // Use native ETH
const COLLATERAL_DECIMALS = 6; // USDC has 6 decimals, ETH uses 18

// Provider (MetaMask / WalletConnect)
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

// Contract instance
const sportsAMM = new ethers.Contract(SPORTS_AMM_V2_CONTRACT_ADDRESS, sportsAMMV2ContractAbi, signer);

export async function placeBet(marketId, team, amount, collateral) {
    try {
        if (!marketId || !team || !amount) throw new Error("Invalid bet parameters");

        console.log("Placing bet on:", marketId, "Side:", team, "Amount:", amount, "Collateral:", collateral);

        // Convert amount to the correct format
        const parsedAmount = collateral === COLLATERAL_ETH
            ? ethers.utils.parseEther(amount.toString())
            : ethers.utils.parseUnits(amount.toString(), COLLATERAL_DECIMALS);

        // Define trade parameters
        const tradeData = {
            marketId,
            selectedSide: team === "home" ? 0 : 1, // 0 = home, 1 = away
            buyInAmount: parsedAmount,
            collateral: collateral
        };

        // Execute trade
        const tx = await sportsAMM.trade(
            tradeData.marketId,
            tradeData.selectedSide,
            tradeData.buyInAmount,
            tradeData.collateral
        );

        await tx.wait(); // Wait for transaction to be mined
        alert("Bet placed successfully!");
    } catch (error) {
        console.error("Bet failed:", error);
        alert("Bet failed: " + error.message);
    }
}
