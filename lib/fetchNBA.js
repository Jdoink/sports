export const fetchLatestNBAGame = async () => {
  try {
    console.log("Fetching latest NBA games...");

    const response = await fetch("https://overtimemarketsv2.xyz/overtime-v2/networks/10/markets");
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const games = await response.json();
    console.log("API Response:", games);

    // Filter NBA games (Sport ID = 4) that are open for betting
    const nbaGames = games.filter((game) => game.sport === "Basketball" && game.isOpen);

    if (nbaGames.length > 0) {
      const selectedGame = nbaGames[Math.floor(Math.random() * nbaGames.length)];
      console.log("Selected NBA game:", selectedGame);
      return selectedGame;
    } else {
      console.warn("No open NBA games found!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching NBA game:", error);
    return null;
  }
};
