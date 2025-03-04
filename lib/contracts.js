import { ethers } from "ethers";
import sportsAMMV2ContractAbi from "./sportsAMMV2ContractAbi.js"; // Ensure this file exists

const SPORTS_AMM_V2_CONTRACT_ADDRESS = "0xFb4e4811C7A811E098A556bD79B64c20b479E431"; // Sports AMM V2 contract
const COLLATERAL_USDC = "0x7F5c764cBc14f9669B88837ca1490cCa17c31607"; // USDC on Optimism
const COLLATERAL_ETH = ethers.constants.AddressZero; // Use native ETH
const COLLATERAL_DECIMALS = 6; // USDC has 6 decimals, ETH uses 18

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const sportsAMM = new ethers.Contract(SPORTS_AMM_V2_CONTRACT_ADDRESS, sportsAMMV2ContractAbi, signer);

export async function placeBet(marketId, team, amount, paymentMethod) {
    try {
        if (!marketId || !team || !amount) throw new Error("Invalid bet parameters");

        console.log("Placing bet on:", marketId, "Side:", team, "Amount:", amount, "Collateral:", paymentMethod);

        const collateral = paymentMethod === "USDC" ? COLLATERAL_USDC : COLLATERAL_ETH;
        const parsedAmount = collateral === COLLATERAL_ETH
            ? ethers.utils.parseEther(amount.toString())
            : ethers.utils.parseUnits(amount.toString(), COLLATERAL_DECIMALS);

        const tx = await sportsAMM.trade(
            marketId,
            team === "home" ? 0 : 1, // 0 = home, 1 = away
            parsedAmount,
            collateral
        );

        await tx.wait();
        alert(`Bet placed successfully using ${paymentMethod}!`);
    } catch (error) {
        console.error("Bet failed:", error);
        alert("Bet failed: " + error.message);
    }
}
