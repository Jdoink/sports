export async function placeBet(marketId, team, amount, walletAddress) {
    console.log("Placing bet...", { marketId, team, amount, walletAddress });

    const response = await fetch("https://api.thalesmarket.io/overtime/place-bet", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            marketId: marketId,
            selectedSide: team, // 'home' or 'away'
            amount: amount, // In wei
            walletAddress: walletAddress
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error("Bet placement error:", errorData);
        throw new Error(`Bet failed: ${errorData.message || "Unknown error"}`);
    }

    const result = await response.json();
    console.log("Bet placed successfully:", result);
    return result;
}
