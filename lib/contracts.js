export async function placeBet(marketId, team, amount, walletAddress) {
    try {
        console.log(`Placing bet on ${team} for market ${marketId}...`);

        const response = await fetch(
            "https://overtimemarketsv2.xyz/overtime-v2/networks/10/place-bet", 
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    marketId: marketId,
                    selectedSide: team, // 'home' or 'away'
                    amount: amount, // Ensure it's in the correct format (wei)
                    walletAddress: walletAddress
                }),
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Bet failed: ${errorData.message || "Unknown error"}`);
        }

        const result = await response.json();
        console.log("Bet placed successfully:", result);
        return result;
    } catch (error) {
        console.error("Error placing bet:", error.message);
        throw error;
    }
}
