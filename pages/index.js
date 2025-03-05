import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { getTradeQuote, placeBet } from "../lib/contracts";
import WalletConnectButton from "../components/WalletConnectButton";

export default function Home() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [buyInAmount, setBuyInAmount] = useState("");
  const [quote, setQuote] = useState(null);
  
  useEffect(() => {
    async function fetchLatestNBA() {
      try {
        const response = await fetch(
          "https://api.overtimemarkets.xyz/overtime-v2/networks/10/games?sportId=4"
        );
        const data = await response.json();
        
        if (data && data.length > 0) {
          setSelectedGame(data[0]); // Select the latest NBA game
        }
      } catch (error) {
        console.error("Error fetching NBA game:", error);
      }
    }

    fetchLatestNBA();
  }, []);

  async function handleGetQuote() {
    if (!provider || !selectedGame || !buyInAmount) return;

    const tradeData = [
      {
        gameId: selectedGame.gameId,
        sportId: 4,
        typeId: 0,
        maturity: selectedGame.maturity,
        status: selectedGame.status,
        line: selectedGame.line,
        playerId: 0,
        position: 0,
        odds: selectedGame.odds,
        combinedPositions: [[1], [1]],
      },
    ];

    const quoteData = await getTradeQuote(provider, tradeData, ethers.utils.parseUnits(buyInAmount, 6));
    setQuote(quoteData);
  }

  async function handlePlaceBet() {
    if (!signer || !selectedGame || !quote || !buyInAmount) return;

    const tradeData = [
      {
        gameId: selectedGame.gameId,
        sportId: 4,
        typeId: 0,
        maturity: selectedGame.maturity,
        status: selectedGame.status,
        line: selectedGame.line,
        playerId: 0,
        position: 0,
        odds: selectedGame.odds,
        combinedPositions: [[1], [1]],
      },
    ];

    await placeBet(signer, tradeData, ethers.utils.parseUnits(buyInAmount, 6), quote.totalQuote);
  }

  return (
    <div>
      <h1>Sports Betting</h1>
      <WalletConnectButton setProvider={setProvider} setSigner={setSigner} />
      {selectedGame ? (
        <>
          <h2>{selectedGame.teamA} vs {selectedGame.teamB}</h2>
          <label>Buy-In Amount</label>
          <input 
            type="text" 
            value={buyInAmount} 
            onChange={(e) => setBuyInAmount(e.target.value)} 
          />
          <button onClick={handleGetQuote}>Get Quote</button>
          <button onClick={handlePlaceBet}>Place Bet</button>
          {quote && <p>Quote: {quote.totalQuote}</p>}
        </>
      ) : (
        <p>Loading latest NBA game...</p>
      )}
    </div>
  );
}
