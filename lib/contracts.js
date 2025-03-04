import { ethers } from "ethers";
import sportsAMMV2ContractAbi from "./sportsAMMV2ContractAbi.js";

const USDC_ADDRESS = "0x7F5c764cBc14f9669B88837ca1490cCa17c31607"; // ✅ Optimism USDC
const SPORTS_AMM_V2_CONTRACT_ADDRESS = "0xFb4e4811C7A811E098A556bD79B64c20b479E431"; // ✅ Correct AMM Contract

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const sportsAMM = new ethers.Contract(SPORTS_AMM_V2_CONTRACT_ADDRESS, sportsAMMV2ContractAbi, signer);

export async function placeBet(gameId, team, betAmount) {
  const usdcAmount = ethers.utils.parseUnits(betAmount.toString(), 6); // Convert to USDC's 6 decimal format

  console.log("⚡️ Preparing to send bet transaction...");
  console.log("🆔 Game ID:", gameId);
  console.log("🏀 Team Selected:", team);
  console.log("💰 Bet Amount in USDC:", betAmount);
  console.log("🔢 Converted USDC Amount:", usdcAmount.toString());
  console.log("📝 USDC Contract Address:", USDC_ADDRESS);
  console.log("🎰 Sports AMM Contract:", SPORTS_AMM_V2_CONTRACT_ADDRESS);

  try {
    const tx = await sportsAMM.trade(
      gameId, // Game ID
      team, // Team (check if correct format)
      usdcAmount, // Bet amount in USDC
      USDC_ADDRESS, // USDC contract address
      {
        gasLimit: 500000, // Increase if needed
      }
    );

    console.log("✅ Transaction sent! TX Hash:", tx.hash);
    await tx.wait();
    console.log("🎉 Bet successfully placed!");
  } catch (error) {
    console.error("❌ Bet Transaction Failed:", error);
    alert(`Transaction failed: ${error.message}`);
  }
}
