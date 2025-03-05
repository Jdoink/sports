import { ethers } from "ethers";
import sportsAMMV2Abi from "./sportsAMMV2ContractAbi";

const SPORTS_AMM_V2_ADDRESS = "0xYourSportsAMMV2ContractAddress"; // Replace with actual deployed contract
const USDC_ADDRESS = "0xYourUSDCContractAddress"; // Replace with actual stablecoin contract

export const getContract = (provider) => {
  return new ethers.Contract(SPORTS_AMM_V2_ADDRESS, sportsAMMV2Abi, provider);
};

export const getTradeQuote = async (provider, tradeData, buyInAmount) => {
  try {
    const contract = getContract(provider);
    const quote = await contract.tradeQuote(tradeData, buyInAmount, USDC_ADDRESS, false);
    return quote;
  } catch (error) {
    console.error("Error fetching trade quote:", error);
    return null;
  }
};

export const placeBet = async (signer, tradeData, buyInAmount, expectedQuote) => {
  try {
    const contract = getContract(signer);
    const tx = await contract.trade(
      tradeData, 
      buyInAmount, 
      expectedQuote, 
      0, 
      "0x0000000000000000000000000000000000000000", 
      USDC_ADDRESS, 
      false
    );
    await tx.wait();
    console.log("Bet placed successfully:", tx);
    return tx;
  } catch (error) {
    console.error("Error placing bet:", error);
    return null;
  }
};
