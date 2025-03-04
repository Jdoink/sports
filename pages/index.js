import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { getSportsAmmContract, getUSDCContract } from "../lib/contracts";

export default function Home() {
    const [provider, setProvider] = useState(null);
    const [userAddress, setUserAddress] = useState("");
    const [betAmount, setBetAmount] = useState("");
    const [gameData, setGameData] = useState({
        gameId: "0x345f463641383645323331423239000000000000000000000000000000000000", // Example game ID
        homeTeam: "San Antonio Spurs",
        awayTeam: "Brooklyn Nets",
        sportId: 1,
        typeId: 1,
        maturity: Math.floor(Date.now() / 1000) + 86400, // 1 day later
        status: 0,
        line: 0,
        odds: [150, -150],
    });

    useEffect(() => {
        if (window.ethereum) {
            const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
            setProvider(web3Provider);
        }
    }, []);

    const connectWallet = async () => {
        if (!window.ethereum) {
            alert("Install MetaMask!");
            return;
        }
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const signer = web3Provider.getSigner();
        setProvider(web3Provider);
        setUserAddress(await signer.getAddress());
    };

    const handleBet = async (team) => {
        if (!provider || !userAddress) {
            alert("Please connect your wallet first.");
            return;
        }

        const formattedGameId = ethers.utils.formatBytes32String(gameData.gameId);
        console.log("Formatted Game ID:", formattedGameId);

        const tradeData = {
            gameId: formattedGameId,
            sportId: gameData.sportId,
            typeId: gameData.typeId,
            maturity: gameData.maturity,
            status: gameData.status,
            line: gameData.line,
            playerId: 0,
            position: team === "home" ? 0 : 1, // 0 for home, 1 for away
            odds: gameData.odds,
            combinedPositions: [false, false, false],
        };

        console.log("Trade Data:", tradeData);

        const sportsAmmContract = getSportsAmmContract(provider);
        const usdcContract = getUSDCContract(provider);

        try {
            console.log("Fetching trade quote...");
            const [totalQuote, payout] = await sportsAmmContract.tradeQuote(
                [tradeData],
                ethers.utils.parseUnits(betAmount, 6),
                USDC_ADDRESS,
                false
            );

            console.log("Expected Payout:", payout.toString());

            if (payout.eq(0)) {
                console.error("Trade failed: Invalid payout.");
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
            console.log("Bet successfully placed!");

        } catch (error) {
            console.error("Error placing bet:", error);
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
            <h3>{gameData.homeTeam} vs {gameData.awayTeam}</h3>
            <input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                placeholder="Enter USDC amount"
            />
            <button onClick={() => handleBet("home")}>Bet on {gameData.homeTeam}</button>
            <button onClick={() => handleBet("away")}>Bet on {gameData.awayTeam}</button>
        </div>
    );
}
