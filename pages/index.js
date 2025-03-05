import { useState, useEffect } from "react";
import { ethers } from "ethers";
import axios from "axios";
import sportsAMMV2ContractAbi from "../lib/sportsAMMV2ContractAbi";
import { getNBAQuote } from "../lib/queries"; // ✅ Ensure correct path

const SPORTS_AMM_V2_CONTRACT = "0xFb4e4811C7A811E098A556bD79B64c20b479E431";
const NETWORK_ID = 10;
const API_URL = "https://overtimemarketsv2.xyz";

export default function Home() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [market, setMarket] = useState(null);
  const [betAmount, setBetAmount] = useState(5);
  
  useEffect(() => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);
      setSigner(provider.getSigner());
      setContract(new ethers.Contract(SPORTS_AMM_V2_CONTRACT, sportsAMMV2ContractAbi, provider.getSigner()));
    }
  }, []);

  const fetchMarket = async () => {
    try {
      const response = await axios.get(`${API_URL}/overtime-v2/networks/${NETWORK_ID}/markets?sport=basketball`);
      setMarket(response.data[0]); // ✅ Ensure NBA game selection
    } catch (error) {
      console.error("Error fetching NBA markets:", error);
    }
  };

  const placeBet = async (position) => {
    if (!signer || !market) return;

    try {
      console.log("Fetching trade quote...");
      const tradeData = await getNBAQuote(market, betAmount);
      
      console.log("Quote Data:", tradeData);

      const tx = await contract.trade(
        tradeData.gameId,
        position,
        ethers.utils.parseUnits(betAmount.toString(), 18)
      );
      
      await tx.wait();
      console.log("Bet placed successfully:", tx.hash);
    } catch (error) {
      console.error("Error placing bet:", error);
    }
  };

  return (
    <div>
      <h1>NBA Betting</h1>
      <button onClick={fetchMarket}>Fetch NBA Game</button>
      {market && <h2>{market.homeTeam} vs {market.awayTeam}</h2>}
      <input type="number" value={betAmount} onChange={(e) => setBetAmount(e.target.value)} />
      {market && (
        <>
          <button onClick={() => placeBet(1)}>Bet on {market.homeTeam}</button>
          <button onClick={() => placeBet(2)}>Bet on {market.awayTeam}</button>
        </>
      )}
    </div>
  );
}
