import { ethers } from "ethers";
import SPORTS_AMMV2_ABI from "./sportsAMMV2ContractAbi";

// Sports AMM V2 Contract Address (Optimism)
export const SPORTS_AMM_V2_CONTRACT_ADDRESS = "0xFb4e4811C7A811E098A556bd79B64c20b479E431";
export const USDC_ADDRESS = "0x7F5c764cBc14f9669B88837ca1490cCa17c31607"; // USDC Contract Address on Optimism

async function getValidSigner(provider) {
    if (!provider) {
        throw new Error("Provider is undefined");
    }
    return provider.getSigner();
}

export async function getSportsAmmContract(provider) {
    const signer = await getValidSigner(provider);
    return new ethers.Contract(SPORTS_AMM_V2_CONTRACT_ADDRESS, SPORTS_AMMV2_ABI, signer);
}

export async function getUSDCContract(provider) {
    const signer = await getValidSigner(provider);
    return new ethers.Contract(
        USDC_ADDRESS,
        [
            "function approve(address spender, uint256 amount) public returns (bool)",
            "function allowance(address owner, address spender) public view returns (uint256)",
            "function balanceOf(address account) public view returns (uint256)",
            "function transfer(address recipient, uint256 amount) public returns (bool)"
        ],
        signer
    );
}
