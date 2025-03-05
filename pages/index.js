import { useEffect, useState } from "react";
import { getTradeQuote, placeBet } from "../lib/contracts"; // Uses correct contracts
import WalletConnectButton from "../components/WalletConnectButton";

const SportsBetting = () => {
  const [selectedGame, setSelectedGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buyInAmount, setBuyInAmount] = useState("");

  useEffect(() => {
    (async function fetchNBA() {
      try {
        console.log("Fetching NBA games...");
        const response = await fetch(
          "https://api.thalesmarket.io/overtime/markets?network=10&sportId=4"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response:", data);

        if (data.length > 0) {
          const randomGame = data[Math.floor(Math.random() * data.length)]; // ✅ Selects a random NBA game
          setSelectedGame(randomGame);
        } else {
          console.warn("No NBA games found!");
        }
      } catch (error) {
        console.error("Error fetching NBA game:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleGetQuote = async () => {
    if (!selectedGame || !buyInAmount) {
      alert("Please wait for a game to load and enter a buy-in amount.");
      return;
    }

    try {
      const quote = await getTradeQuote(selectedGame, buyInAmount);
      console.log("Trade Quote:", quote);
    } catch (error) {
      console.error("Error fetching trade quote:", error);
    }
  };

  const handlePlaceBet = async () => {
    if (!selectedGame || !buyInAmount) {
      alert("Please enter a buy-in amount.");
      return;
    }

    try {
      const betResult = await placeBet(selectedGame, buyInAmount);
      console.log("Bet Placed:", betResult);
      alert("Bet successfully placed!");
    } catch (error) {
      console.error("Error placing bet:", error);
      alert("Failed to place bet.");
    }
  };

  return (
    <div>
      <h1>Sports Betting</h1>
      <WalletConnectButton />

      {loading ? (
        <p>Loading an NBA game...</p>
      ) : selectedGame ? (
        <div>
          <h2>Selected NBA Game</h2>
          <p>Game ID: {selectedGame.gameId}</p>
          <p>Maturity: {new Date(selectedGame.maturity * 1000).toLocaleString()}</p>
          <p>Odds: {selectedGame.odds.join(" | ")}</p>

          <h3>Buy-In Amount</h3>
          <input
            type="number"
            value={buyInAmount}
            onChange={(e) => setBuyInAmount(e.target.value)}
          />
          <button onClick={handleGetQuote}>Get Quote</button>
          <button onClick={handlePlaceBet}>Place Bet</button>
        </div>
      ) : (
        <p>No NBA games available.</p>
      )}
    </div>
  );
};

export default SportsBetting;
