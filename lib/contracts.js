import { ethers } from "ethers";
import sportsAMMV2Abi from "./sportsAMMV2ContractAbi";

// Correct contract addresses on Optimism
const SPORTS_AMM_V2_ADDRESS = "0x73660b07dd4ee1298219b341aeb7575c145b9ac9"; // Thales SportsAMMV2 on Optimism
const USDC_ADDRESS = "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85"; // Native USDC on Optimism

export const getContract = (provider) => {
  return new ethers.Contract(SPORTS_AMM_V2_ADDRESS, sportsAMMV2Abi, provider);
};

// Fetch trade quote
export const getTradeQuote = async (provider, tradeData, buyInAmount) => {
  try {
    const contract = getContract(provider);
    const totalQuote = await contract.tradeQuote(tradeData, buyInAmount, USDC_ADDRESS, false);
    return totalQuote;
  } catch (error) {
    console.error("Error fetching trade quote:", error);
    throw error;
  }
};

// Place a bet
export const placeBet = async (signer, tradeData, buyInAmount, expectedQuote) => {
  try {
    const contract = getContract(signer);
    const tx = await contract.trade(
      tradeData,
      buyInAmount,
      expectedQuote,
      0, // No additional slippage
      ethers.constants.AddressZero, // No referrer
      USDC_ADDRESS,
      false // Not paying with ETH
    );
    await tx.wait();
    return tx;
  } catch (error) {
    console.error("Error placing bet:", error);
    throw error;
  }
};
