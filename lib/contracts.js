export async function placeBet(marketId, team, amount, walletAddress) {
    console.log(`Placing bet on market ${marketId} for ${team}`);

    const response = await fetch("https://api.thalesmarket.io/overtime/place-bet", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            marketId: marketId,
            selectedSide: team, // 'home' or 'away'
            amount: amount, // In wei or native token format
            walletAddress: walletAddress
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Bet failed: ${errorData.message || "Unknown error"}`);
    }

    return await response.json();
}
