
const CONTRACT_ADDRESS = "0x2F9E315aE40031bf29dF85CC28572Abf6174b727";

const ABI = [
  {"inputs":[],"name":"joinAsPlayer1","outputs":[],"stateMutability":"payable","type":"function"},
  {"inputs":[],"name":"joinAsPlayer2","outputs":[],"stateMutability":"payable","type":"function"},
  {"inputs":[],"name":"reset","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[],"name":"player1","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"player2","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"winner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"state","outputs":[{"internalType":"enum DuelArena.State","name":"","type":"uint8"}],"stateMutability":"view","type":"function"}
];

let provider;
let signer;
let contract;

async function connectWallet() {
  if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
    document.getElementById("status").innerText = "Wallet connected!";
  } else {
    alert("Please install MetaMask");
  }
}

async function joinAsPlayer1() {
  try {
    const tx = await contract.joinAsPlayer1({ value: ethers.utils.parseEther("0.02") });
    await tx.wait();
    document.getElementById("status").innerText = "Player 1 joined!";
  } catch (err) {
    console.error(err);
    document.getElementById("status").innerText = "Join as Player 1 failed.";
  }
}

async function joinAsPlayer2() {
  try {
    const tx = await contract.joinAsPlayer2({ value: ethers.utils.parseEther("0.02") });
    await tx.wait();
    document.getElementById("status").innerText = "Player 2 joined! Duel started.";
  } catch (err) {
    console.error(err);
    document.getElementById("status").innerText = "Join as Player 2 failed.";
  }
}
