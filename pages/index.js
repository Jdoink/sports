import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { getSportsAmmContract, getUSDCContract } from "../lib/contracts";
import { USDC_ADDRESS, SPORTS_AMM_V2_CONTRACT_ADDRESS } from "../lib/contracts";
import { getRandomMarket } from "../lib/queries";

export default function Home() {
    const [provider, setProvider] = useState(null);
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
                if (!provider) {
                    console.warn("Provider not available yet, waiting...");
                    return;
                }

                const marketData = await getRandomMarket(provider);

                if (!marketData) {
                    console.warn("No valid market data received.");
                    setGameData(null);
                } else {
                    setGameData(marketData);
                    console.log("Market Data Fetched:", marketData);
                }
            } catch (error) {
                console.error("Error fetching market:", error);
                setGameData(null);
            } finally {
                setLoading(false);
            }
        }
        fetchMarket();
    }, [provider]);

    const connectWallet = async () => {
        if (!provider) {
            alert("MetaMask not detected!");
            return;
        }
        try {
            const accounts = await provider.send("eth_requestAccounts", []);
            setUserAddress(accounts[0]);
            console.log("Connected Address:", accounts[0]);
        } catch (error) {
            console.error("Error connecting wallet:", error);
        }
    };

    const handleBet = async (team) => {
        console.log("Bet function started...");

        if (!provider) {
            alert("Wallet not connected!");
            return;
        }
        if (!userAddress) {
            alert("Please connect your wallet first.");
            return;
        }
        if (!gameData) {
            alert("No market data available.");
            return;
        }

        console.log("Provider detected, proceeding with bet...");

        let formattedGameId;
        try {
            if (ethers.utils.isHexString(gameData.gameId, 32)) {
                formattedGameId = gameData.gameId;
            } else {
                formattedGameId = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(gameData.gameId)).slice(0, 66);
            }
        } catch (error) {
            console.error("Error formatting gameId:", error);
            alert("Invalid game ID format.");
            return;
        }

        console.log("Formatted Game ID:", formattedGameId);

        const tradeData = {
            gameId: formattedGameId,
            sportId: gameData.sportId,
            typeId: gameData.typeId,
            maturity: gameData.maturity,
            status: gameData.status,
            line: gameData.line,
            playerId: 0,
            position: team === "home" ? 0 : 1,
            odds: gameData.odds,
            combinedPositions: [false, false, false],
        };

        console.log("Trade Data:", tradeData);

        try {
            const signer = provider.getSigner();
            const sportsAmmContract = getSportsAmmContract(signer);
            const usdcContract = getUSDCContract(signer);

            console.log("Fetching trade quote...");
            const [totalQuote, payout] = await sportsAmmContract.tradeQuote(
                [tradeData],
                ethers.utils.parseUnits(betAmount, 6),
                USDC_ADDRESS,
                false
            );

            console.log("Expected Payout:", payout.toString());

            if (payout.eq(0)) {
                alert("Invalid payout. Bet rejected.");
                return;
            }

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
                [tradeData],
                ethers.utils.parseUnits(betAmount, 6),
                payout,
                ethers.utils.parseUnits("0.01", 18),
                ethers.constants.AddressZero,
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
                <p>Failed to load market data.</p>
            )}
        </div>
    );
}
