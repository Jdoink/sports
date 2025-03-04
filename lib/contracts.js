import { ethers } from "ethers";
import sportsAMMV2ContractAbi from "./sportsAMMV2ContractAbi.js"; // Import ABI

const USDC_ADDRESS = "0x7F5c764cBc14f9669B88837ca1490cCa17c31607"; // ✅ USDC on Optimism
const SPORTS_AMM_V2_CONTRACT_ADDRESS = "0xFb4e4811C7A811E098A556bD79B64c20b479E431"; // ✅ Sports AMM Contract

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const sportsAMM = new ethers.Contract(SPORTS_AMM_V2_CONTRACT_ADDRESS, sportsAMMV2ContractAbi, signer);

async function approveUSDC(amount) {
  try {
    const usdc = new ethers.Contract(USDC_ADDRESS, ["function approve(address spender, uint256 amount) public returns (bool)"], signer);
    const usdcAmount = ethers.utils.parseUnits(amount.toString(), 6); // USDC has 6 decimals

    console.log("⚡️ Approving USDC:", usdcAmount.toString());
    const tx = await usdc.approve(SPORTS_AMM_V2_CONTRACT_ADDRESS, usdcAmount);
    await tx.wait();
    console.log("✅ USDC Approved!");

    return true;
  } catch (error) {
    console.error("❌ USDC Approval Failed:", error);
    alert("USDC Approval Failed: " + error.message);
    return false;
  }
}

export async function placeBet(gameId, teamIndex, betAmount) {
  try {
    const usdcAmount = ethers.utils.parseUnits(betAmount.toString(), 6); // Convert USDC amount

    // **1️⃣ Ensure USDC is Approved First**
    const isApproved = await approveUSDC(betAmount);
    if (!isApproved) {
      console.error("❌ Approval failed, stopping bet.");
      return;
    }

    console.log("⚡️ Preparing to place bet...");
    console.log("🆔 Game ID:", gameId);
    console.log("🏀 Team Selected (0=Home, 1=Away):", teamIndex);
    console.log("💰 Bet Amount in USDC:", betAmount);
    console.log("🔢 Converted USDC Amount:", usdcAmount.toString());

    // **2️⃣ Simulate Transaction Before Sending**
    try {
      const estimatedGas = await sportsAMM.estimateGas.buyFromAMM(
        gameId,
        teamIndex,
        usdcAmount,
        USDC_ADDRESS
      );
      console.log("⛽ Estimated Gas:", estimatedGas.toString());
    } catch (simulationError) {
      console.error("🚨 Transaction Simulation Failed:", simulationError);
      alert(`Transaction Simulation Failed: ${simulationError.message}`);
      return;
    }

    // **3️⃣ Call `buyFromAMM` with Higher Gas Limit**
    const tx = await sportsAMM.buyFromAMM(
      gameId,
      teamIndex,
      usdcAmount,
      USDC_ADDRESS,
      {
        gasLimit: 1500000, // ✅ Increased Gas Limit
      }
    );

    console.log("✅ Bet Transaction Sent! TX Hash:", tx.hash);
    await tx.wait();
    console.log("🎉 Bet Placed Successfully!");

    alert("Bet placed successfully! Transaction: " + tx.hash);
  } catch (error) {
    console.error("❌ Bet Transaction Failed:", error);
    alert(`Transaction failed: ${error.message}`);
  }
}
