import { ethers } from "hardhat";
const helpers = require("@nomicfoundation/hardhat-toolbox/network-helpers");

const main = async () => {
    const USDCAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
    const DAIAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
    const wethAdress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

    const UNIRouter = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";

    const USDCHolder = "0xf584f8728b874a6a5c7a8d4d387c9aae9172d621";

    await helpers.impersonateAccount(USDCHolder);
    const impersonatedSigner = await ethers.getSigner(USDCHolder);

    const amountOut = ethers.parseUnits("1000", 18); // amount of DAI you want to receive
    const amountInMax = ethers.parseUnits("2000", 6); // maximum amount of USDC you're willing to spend
    const path = [USDCAddress, wethAdress, DAIAddress]; // USDC -> WETH -> DAI
    const deadline = Math.floor(Date.now() / 1000) + 60 * 5; // 5 minutes from now

    const USDC = await ethers.getContractAt("IERC20", USDCAddress, impersonatedSigner);
    const DAI = await ethers.getContractAt("IERC20", DAIAddress, impersonatedSigner);
    const WETH = await ethers.getContractAt("IERC20", wethAdress, impersonatedSigner);

    const ROUTER = await ethers.getContractAt("IUniswap", UNIRouter, impersonatedSigner);

    // Approve tokens
    await USDC.approve(UNIRouter, amountInMax);

    // Check balances before swapping
    const usdcBalBefore = await USDC.balanceOf(USDCHolder);
    const daiBalBefore = await DAI.balanceOf(USDCHolder);

    // Swap tokens
    const tx = await ROUTER.swapTokensForExactTokens(
        amountOut,
        amountInMax,
        path,
        USDCHolder,
        deadline
    );
    await tx.wait();

    // Check balances after swapping
    const usdcBalAfter = await USDC.balanceOf(USDCHolder);
    const daiBalAfter = await DAI.balanceOf(USDCHolder);

    console.log("Tokens swapped successfully");
    console.log("USDC Balance Before:", ethers.formatUnits(usdcBalBefore, 6));
    console.log("DAI Balance Before:", ethers.formatUnits(daiBalBefore, 18));
    console.log("USDC Balance After:", ethers.formatUnits(usdcBalAfter, 6));
    console.log("DAI Balance After:", ethers.formatUnits(daiBalAfter, 18));
};

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
