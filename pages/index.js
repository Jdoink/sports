import { useState, useEffect } from "react";
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";
import { fetchNBAMarket } from "../lib/queries";
import dynamic from "next/dynamic";
import { ethers } from "ethers";

// ✅ Dynamically import WalletConnectButton to prevent SSR crash
const WalletConnectButton = dynamic(() => import("../components/WalletConnectButton"), { ssr: false });

const USDC_ADDRESS = "0x7F5c764cBc14f9669B88837ca1490cCa17c31607"; // ✅ Replace with the actual USDC contract address
const SPORTS_AMM_V2_CONTRACT_ADDRESS = "0xFb4e4811C7A811E098A556bD79B64c20b479E431"; // ✅ Replace with actual AMM contract address

export default function Home() {
    const { address, isConnected } = useAccount();
    const [market, setMarket] = useState(null);
    const [betAmount, setBetAmount] = useState("");
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [isClient, setIsClient] = useState(false);

    // ✅ Ensure this only runs in the browser
    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!isClient) return; // Prevents SSR crash
        async function loadMarket() {
            try {
                const nbaMarket = await fetchNBAMarket();
                if (nbaMarket) {
                    setMarket(nbaMarket);
                } else {
                    console.error("No NBA market found.");
                }
            } catch (error) {
                console.error("Error fetching market:", error);
            }
        }
        loadMarket();
    }, [isClient]);

    const handleBet = async (team) => {
        if (!betAmount || isNaN(betAmount) || betAmount <= 0) {
            alert("Enter a valid USDC amount to bet.");
            return;
        }

        setSelectedTeam(team);

        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            // ✅ Get USDC Contract
            const usdcContract = new ethers.Contract(USDC_ADDRESS, [
                "function approve(address spender, uint256 amount) public returns (bool)"
            ], signer);

            // ✅ Approve USDC transfer
            const amountInWei = ethers.utils.parseUnits(betAmount, 6); // USDC has 6 decimals
            const approveTx = await usdcContract.approve(SPORTS_AMM_V2_CONTRACT_ADDRESS, amountInWei);
            await approveTx.wait();

            // ✅ Call Sports AMM contract
            const sportsAMMContract = new ethers.Contract(SPORTS_AMM_V2_CONTRACT_ADDRESS, [
                "function trade(uint256 marketId, uint256 position, uint256 amount) public"
            ], signer);

            const position = team === "home" ? 0 : 1; // 0 = home, 1 = away
            const tradeTx = await sportsAMMContract.trade(market.gameId, position, amountInWei);
            await tradeTx.wait();

            alert(`Bet placed on ${team === "home" ? market.homeTeam : market.awayTeam} for ${betAmount} USDC!`);
        } catch (error) {
            console.error("Betting error:", error);
            alert("Transaction failed.");
        }
    };

    if (!isClient) return <p>Loading...</p>;

    return (
        <div>
            <h1>NBA Betting</h1>
            <WalletConnectButton />

            {market ? (
                <div>
                    <p>{market.homeTeam} vs {market.awayTeam}</p>
                    <input
                        type="number"
                        placeholder="Enter USDC amount"
                        value={betAmount}
                        onChange={(e) => setBetAmount(e.target.value)}
                        style={{ marginRight: "10px" }}
                    />
                    <button onClick={() => handleBet("home")}>Bet on {market.homeTeam}</button>
                    <button onClick={() => handleBet("away")}>Bet on {market.awayTeam}</button>
                </div>
            ) : (
                <p style={{ color: "red" }}>No NBA market found.</p>
            )}

            <div style={{ marginTop: "20px", border: "1px solid #000", padding: "10px" }}>
                <h3>Debug Logs:</h3>
                <p>Market Data: {market ? JSON.stringify(market) : "Loading..."}</p>
            </div>
        </div>
    );
}
