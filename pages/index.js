import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { getTradeQuote, placeBet } from "../lib/contracts";
import WalletConnectButton from "../components/WalletConnectButton";

export default function Home() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [marketData, setMarketData] = useState([]);
  const [selectedMarket, setSelectedMarket] = useState(null);
  const [buyInAmount, setBuyInAmount] = useState("");
  const [quote, setQuote] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      const newProvider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(newProvider);
      setSigner(newProvider.getSigner());
    }
  }, []);

  const fetchQuote = async () => {
    if (!selectedMarket || !buyInAmount) return;
    const tradeData = [
      {
        gameId: selectedMarket.id,
        sportId: 4,
        typeId: 0,
        maturity: selectedMarket.maturity,
        status: "open",
        odds: selectedMarket.odds,
        position: 0,
        combinedPositions: [false, false, false]
      }
    ];
    const quoteResult = await getTradeQuote(provider, tradeData, ethers.utils.parseUnits(buyInAmount, 18));
    setQuote(quoteResult);
  };

  const handleBet = async () => {
    if (!signer || !quote) return;
    const tradeData = [
      {
        gameId: selectedMarket.id,
        sportId: 4,
        typeId: 0,
        maturity: selectedMarket.maturity,
        status: "open",
        odds: selectedMarket.odds,
        position: 0,
        combinedPositions: [false, false, false]
      }
    ];
    await placeBet(signer, tradeData, ethers.utils.parseUnits(buyInAmount, 18), quote.totalQuote);
  };

  return (
    <div>
      <h1>Sports Betting</h1>
      <WalletConnectButton setProvider={setProvider} setSigner={setSigner} />

      <h2>Select a Market</h2>
      <select onChange={(e) => setSelectedMarket(marketData[e.target.value])}>
        {marketData.map((market, index) => (
          <option key={market.id} value={index}>
            {market.homeTeam} vs {market.awayTeam}
          </option>
        ))}
      </select>

      <h2>Buy-In Amount</h2>
      <input type="text" value={buyInAmount} onChange={(e) => setBuyInAmount(e.target.value)} />

      <button onClick={fetchQuote}>Get Quote</button>
      {quote && <p>Expected Payout: {quote.payout}</p>}

      <button onClick={handleBet}>Place Bet</button>
    </div>
  );
}
