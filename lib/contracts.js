import { ethers } from "ethers";
import sportsAMMV2Abi from "./sportsAMMV2ContractAbi";

// ✅ Thales Sports AMM V2 contract address on Optimism
const SPORTS_AMM_V2_ADDRESS = "0xFb4e4811C7A811E098A556bD79B64c20b479E431"; // Source: https://docs.overtimemarkets.xyz/overtime-v2-integration
const USDC_ADDRESS = "0x7F5c764cBc14f9669B88837ca1490cCa17c31607"; // USDC contract address on Optimism

export const getContract = (provider) => {
  return new ethers.Contract(SPORTS_AMM_V2_ADDRESS, sportsAMMV2Abi, provider);
};

export const getTradeQuote = async (gameData, buyInAmount) => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = getContract(provider);

    const tradeData = [
      {
        gameId: gameData.gameId,
        sportId: 4,
        typeId: 0,
        maturity: gameData.maturity,
        status: gameData.status,
        line: gameData.line,
        playerId: 0,
        position: 0,
        odds: gameData.odds,
        combinedPositions: [[1], [1]],
      },
    ];

    const result = await contract.tradeQuote(tradeData, ethers.utils.parseUnits(buyInAmount, 6), USDC_ADDRESS, false);
    return result;
  } catch (error) {
    console.error("Error fetching trade quote:", error);
    throw error;
  }
};

export const placeBet = async (gameData, buyInAmount) => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = getContract(signer);

    const tradeData = [
      {
        gameId: gameData.gameId,
        sportId: 4,
        typeId: 0,
        maturity: gameData.maturity,
        status: gameData.status,
        line: gameData.line,
        playerId: 0,
        position: 0,
        odds: gameData.odds,
        combinedPositions: [[1], [1]],
      },
    ];

    const tx = await contract.trade(
      tradeData,
      ethers.utils.parseUnits(buyInAmount, 6),
      0, // Expected Quote (0 for now)
      0, // Additional Slippage
      "0x0000000000000000000000000000000000000000", // No referrer
      USDC_ADDRESS,
      false // Not using ETH
    );

    await tx.wait();
    return tx;
  } catch (error)
::contentReference[oaicite:0]{index=0}
 
