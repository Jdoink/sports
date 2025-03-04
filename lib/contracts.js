import { ethers } from "ethers";
import sportsAMMV2ContractAbi from "./sportsAMMV2ContractAbi.js";

const USDC_ADDRESS = "0x7F5c764cBc14f9669B88837ca1490cCa17c31607"; // ✅ Optimism USDC
const SPORTS_AMM_V2_CONTRACT_ADDRESS = "0xFb4e4811C7A811E098A556bD79B64c20b479E431"; // ✅ Correct AMM Contract

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const sportsAMM = new ethers.Contract(SPORTS_AMM_V2_CONTRACT_ADDRESS, sportsAMMV2ContractAbi, signer);

export async function placeBet(gameId, team, betAmount) {
  const usdcAmount = ethers.utils.parseUnits(betAmount.toString(), 6); // Convert bet amount to 6 decimal USDC format

  console.log("⚡️ Attempting to place bet...");
  console.log("🆔 Game ID:", gameId);
  console.log("🏀 Team:", team);
  console.log("💰 Bet Amount in USDC (raw):", betAmount);
  console.log("🔢 Bet Amount (Parsed):", usdcAmount.toString());
  console.log("📝 USDC Contract:", USDC_ADDRESS);
  console.log("🎰 AMM Contract:", SPORTS_AMM_V2_CONTRACT_ADDRESS);

  try {
    const tx = await sportsAMM.trade(
      gameId, // Game ID
      team, // Chosen team (ensure it matches contract expectation)
      usdcAmount, // Bet amount in USDC
      USDC_ADDRESS, // USDC contract address
      {
        gasLimit: 500000, // Adjust as needed
      }
    );

    console.log("✅ Transaction sent! TX:", tx.hash);
    await tx.wait();
    console.log("🎉 Bet placed successfully!");
  } catch (error) {
    console.error("❌ Transaction failed:", error);
    alert(`Transaction failed: ${error.message}`);
  }
}
