import { ethers } from "./ethers.min.js";
import abi from "./duel-arena-abi.js";

const contractAddress = "0x898D5b5F5ef690959dF87399972Db66308D3c02D";
const betAmount = ethers.utils.parseEther("0.02");

let provider;
let signer;
let contract;
let userAddress;

async function connectWallet() {
    if (!window.ethereum) {
        alert("MetaMask not detected!");
        return;
    }
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    userAddress = await signer.getAddress();
    contract = new ethers.Contract(contractAddress, abi, signer);
    updateStatus();
    document.getElementById("walletStatus").innerText = "Wallet connected";
}

async function joinAsPlayer1() {
    if (!contract) return;
    try {
        const tx = await contract.joinAsPlayer1({ value: betAmount });
        await tx.wait();
        updateStatus();
    } catch (err) {
        alert("Error joining as Player 1: " + err.message);
        console.error(err);
    }
}

async function joinAsPlayer2() {
    if (!contract) return;
    try {
        const tx = await contract.joinAsPlayer2({ value: betAmount });
        await tx.wait();
        updateStatus();
    } catch (err) {
        alert("Error joining as Player 2: " + err.message);
        console.error(err);
    }
}

async function resetDuel() {
    if (!contract) return;
    try {
        const tx = await contract.reset();
        await tx.wait();
        updateStatus();
    } catch (err) {
        alert("Error resetting duel: " + err.message);
        console.error(err);
    }
}

async function updateStatus() {
    if (!contract) return;
    try {
        const player1 = await contract.player1();
        const player2 = await contract.player2();
        const winner = await contract.winner();
        const state = await contract.state();

        if (document.getElementById("player1")) document.getElementById("player1").innerText = "Player 1: " + player1;
        if (document.getElementById("player2")) document.getElementById("player2").innerText = "Player 2: " + player2;
        if (document.getElementById("winner")) document.getElementById("winner").innerText = "Winner: " + winner;
        if (document.getElementById("state")) {
            const states = ["WaitingForPlayer1", "WaitingForPlayer2", "InProgress", "Finished"];
            document.getElementById("state").innerText = "State: " + states[state];
        }
    } catch (err) {
        console.error("Failed to update status:", err);
    }
}

// Attach to window for button usage
window.connectWallet = connectWallet;
window.joinAsPlayer1 = joinAsPlayer1;
window.joinAsPlayer2 = joinAsPlayer2;
window.resetDuel = resetDuel;