import { useState } from "react";
import { useQuery } from "@apollo/client";
import { useAccount, useSigner } from "wagmi";
import { placeBet } from "../lib/contracts";
import { GET_TOP_LIQUIDITY_MARKET } from "@/lib/queries";
";

export default function Home() {
  const { data, loading } = useQuery(GET_TOP_LIQUIDITY_MARKET);
  const { address } = useAccount();
  const { data: signer } = useSigner();
  const [betting, setBetting] = useState(false);

  if (loading) return <p>Loading daily bet...</p>;
  const market = data?.sportsMarkets[0];

  async function handleBet(team) {
    if (!signer) return alert("Connect your wallet first!");
    setBetting(true);
    try {
      await placeBet(market.id, team, "10000000000000000", signer);
      alert("Bet placed successfully!");
    } catch (error) {
      console.error(error);
      alert("Bet failed!");
    }
    setBetting(false);
  }

  return (
    <div>
      <h1>Daily Bet: {market?.homeTeam} vs {market?.awayTeam}</h1>
      <p>Liquidity: {market?.liquidity} ETH</p>
      <button onClick={() => handleBet(0)} disabled={betting}>
        Bet on {market?.homeTeam}
      </button>
      <button onClick={() => handleBet(1)} disabled={betting}>
        Bet on {market?.awayTeam}
      </button>
    </div>
  );
}
