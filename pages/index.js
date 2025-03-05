import { useEffect, useState } from "react";
import { fetchLatestNBAGame } from "../lib/fetchNBA";
import { getTradeQuote } from "../lib/contracts";
import { useWeb3React } from "@web3-react/core";

export default function Home() {
  const { library } = useWeb3React();
  const [game, setGame] = useState(null);
  const [buyInAmount, setBuyInAmount] = useState("");

  useEffect(() => {
    const loadGame = async () => {
      const nbaGame = await fetchLatestNBAGame();
      if (nbaGame) setGame(nbaGame);
    };
    loadGame();
  }, []);

  const handleGetQuote = async () => {
    if (!game || !buyInAmount) {
      alert("Please wait for a game to load and enter a buy-in amount.");
      return;
    }

    try {
      const quote = await getTradeQuote(library.getSigner(), game, buyInAmount);
      console.log("Trade Quote:", quote);
    } catch (error) {
      console.error("Error fetching trade quote:", error);
    }
  };

  return (
    <div>
      <h1>Sports Betting</h1>
      {game ? (
        <div>
          <h2>{game.homeTeam} vs {game.awayTeam}</h2>
          <p>Start Time: {new Date(game.maturityDate).toLocaleString()}</p>
          <p>Odds: {game.odds.map(o => ` ${o.decimal}`).join(", ")}</p>
          <input
            type="number"
            value={buyInAmount}
            onChange={(e) => setBuyInAmount(e.target.value)}
            placeholder="Enter Buy-In Amount"
          />
          <button onClick={handleGetQuote}>Get Quote</button>
        </div>
      ) : (
        <p>Loading latest NBA game...</p>
      )}
    </div>
  );
}
