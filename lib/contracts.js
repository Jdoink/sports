import { ethers } from "ethers";
import sportsAMMV2Abi from "./sportsAMMV2ContractAbi";

const SPORTS_AMM_V2_ADDRESS = "0x5F52BEEfF1d30FAc4D4691f2C1cA2e40A2D7C3a6"; // Correct SportsAMMV2 address on Optimism
const USDC_ADDRESS = "0x7F5c764cBc14f9669B88837ca1490cCa17c31607"; // Correct Optimism USDC contract address

export const getContract = (provider) => {
  return new ethers.Contract(SPORTS_AMM_V2_ADDRESS, sportsAMMV2Abi, provider);
};

export const getTradeQuote = async (provider, tradeData, buyInAmount) => {
  try {
    const contract = getContract(provider);
    const quote = await contract.getTradeQuote(tradeData, buyInAmount, USDC_ADDRESS);
    return quote;
  } catch (error) {
    console.error("Error fetching trade quote:", error);
  }
};
