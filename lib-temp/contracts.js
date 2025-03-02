import { ethers } from "ethers";

const AMM_CONTRACT_ADDRESS = "0x..."; // Replace with actual contract address
const AMM_ABI = [
  "function buyFromAMM(address market, uint outcome, uint amount, uint slippage) external"
];

export async function placeBet(marketId, selectedTeam, amount, signer) {
  const contract = new ethers.Contract(AMM_CONTRACT_ADDRESS, AMM_ABI, signer);
  const tx = await contract.buyFromAMM(marketId, selectedTeam, amount, 0);
  await tx.wait();
  return tx;
}
