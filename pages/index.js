import { useState, useEffect } from "react";
import { ethers } from "ethers";
import axios from "axios";
import { getSportsAmmContract, getUSDCContract } from "../lib/contracts";
import { USDC_ADDRESS, SPORTS_AMM_V2_CONTRACT_ADDRESS } from "../lib/contracts";
import { getTopMarket } from "../lib/queries";

export default function Home() {
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [userAddress, setUserAddress] = useState("");
    const [betAmount, setBetAmount] = useState("5");
    const [gameData, setGameData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (window.ethereum) {
            const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
            setProvider(web3Provider);
        }
    }, []);

    useEffect(() => {
        async function fetchMarket() {
            setLoading(true);
            try {
                const marketData = await getTopMarket();
                if (!marketData) {
                    console.error("No valid market data received.");
                    setGameData(null);
                } else {
                    setGameData(marketData);
                    console.log("Market Data Fetched:", marketData);
                }
            } catch (error) {
                console.error("Error fetching market:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchMarket();
    }, []);

    const connectWallet = async () => {
        if (!provider) {
            alert("MetaMask not detected!");
            return;
        }
        try {
            const accounts = await provider.send("eth_requestAccounts", []);
            setUserAddress(accounts[0]);
            setSigner(provider.getSigner());
            console.log("Connected Address:", accounts[0]);
        } catch (error) {
            console.error("Error connecting wallet:", error);
        }
    };

    const handleBet = async (team) => {
        console.log("Bet function started...");

        if (!signer) {
            alert("Wallet not connected or signer unavailable!");
            return;
        }

        console.log("Signer detected, proceeding with bet...");

        if (!gameData || !gameData.gameId || !gameData.odds || gameData.odds.length === 0) {
            console.error("Invalid game data:", gameData);
            alert("Invalid game data. Please try again later.");
            return;
        }

        let formattedGameId;
        try {
            formattedGameId = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(gameData.gameId)).slice(0, 66);
        } catch (error) {
            console.error("Error formatting gameId:", error);
            alert("Invalid game ID format.");
            return;
        }

        console.log("Formatted Game ID:", formattedGameId);

        const tradeData = [
            {
                gameId: formattedGameId,
                sportId: gameData.sportId || 4, // Default to basketball if missing
                typeId: gameData.typeId || 0, // Ensure a valid typeId is set
                maturity: gameData.maturity || 0,
                status: gameData.status || "open",
                line: gameData.line || 0,
                playerId: 0,
                position: team === "home" ? 0 : 1,
                odds: gameData.odds.map((odd) => odd.normalizedImplied), // Use normalized implied odds
                combinedPositions: [false, false, false],
            },
        ];

        console.log("Trade Data:", tradeData);

        try {
            // Fetch quote from Overtime V2 API
            console.log("Fetching trade quote from API...");
            const quoteResponse = await axios.post(
                `https://overtimemarketsv2.xyz/overtime-v2/networks/10/quote`,
                {
                    buyInAmount: parseFloat(betAmount),
                    tradeData: tradeData,
                    collateral: "USDC",
                }
            );

            const quoteData = quoteResponse.data;
            console.log("Quote Data:", quoteData);

            if (!quoteData.quoteData || !quoteData.quoteData.totalQuote || !quoteData.quoteData.payout) {
                console.error("Invalid quote response:", quoteData);
                alert("Failed to fetch valid quote. Please try again.");
                return;
            }

            const totalQuote = ethers.utils.parseEther(quoteData.quoteData.totalQuote.decimal.toString());
            const payout = ethers.utils.parseEther(quoteData.quoteData.payout.usd.toString());

            console.log("Total Quote:", totalQuote.toString());
            console.log("Expected Payout:", payout.toString());

            if (payout.eq(0)) {
                alert("Invalid payout. Bet rejected.");
                return;
            }

            const sportsAmmContract = getSportsAmmContract(signer);
            const usdcContract = getUSDCContract(signer);

            console.log("Checking USDC allowance...");
            const allowance = await usdcContract.allowance(userAddress, SPORTS_AMM_V2_CONTRACT_ADDRESS);
            console.log("Current Allowance:", allowance.toString());

            if (allowance.lt(ethers.utils.parseUnits(betAmount, 6))) {
                console.log("Approving USDC spending...");
                const approveTx = await usdcContract.approve(
                    SPORTS_AMM_V2_CONTRACT_ADDRESS,
                    ethers.constants.MaxUint256
                );
                await approveTx.wait();
                console.log("USDC Approved.");
            }

            console.log("Placing bet...");
            const tx = await sportsAmmContract.trade(
                tradeData,
                ethers.utils.parseUnits(betAmount, 6),
                totalQuote,
                ethers.utils.parseUnits("0.01", 18), // 1% slippage tolerance
                ethers.constants.AddressZero, // No referral
                USDC_ADDRESS,
                false
            );

            console.log("Transaction Sent:", tx.hash);
            await tx.wait();
            alert("Bet successfully placed!");

        } catch (error) {
            console.error("Error placing bet:", error);
            alert("Bet failed. Check console for details.");
        }
    };

    return (
        <div>
            <h1>NBA Betting</h1>
            {userAddress ? (
                <p>Connected: {userAddress}</p>
            ) : (
                <button onClick={connectWallet}>Connect Wallet</button>
            )}

            {loading ? (
                <p>Loading market data...</p>
            ) : gameData ? (
                <>
                    <h2>{gameData.homeTeam} vs {gameData.awayTeam}</h2>
                    <input
                        type="number"
                        value={betAmount}
                        onChange={(e) => setBetAmount(e.target.value)}
                        placeholder="Enter USDC Amount"
                    />
                    <button onClick={() => handleBet("home")}>Bet on {gameData.homeTeam}</button>
                    <button onClick={() => handleBet("away")}>Bet on {gameData.awayTeam}</button>
                </>
            ) : (
                <p>No active markets available.</p>
            )}
        </div>
    );
}
