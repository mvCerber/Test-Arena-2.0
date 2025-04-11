
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

let provider, signer, contract;

async function connectWallet() {
  if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
    document.getElementById("player1").innerText = await contract.player1();
    document.getElementById("player2").innerText = await contract.player2();
    document.getElementById("winner").innerText = await contract.winner();
    const state = await contract.state();
    document.getElementById("state").innerText = ["Waiting", "Ready", "Finished"][state];
  } else {
    alert("Please install MetaMask or use WalletConnect.");
  }
}

async function connectWithQR() {
  const walletConnectProvider = new WalletConnectProvider.default({
    rpc: {
      97: "https://data-seed-prebsc-1-s1.binance.org:8545"
    },
    chainId: 97
  });
  await walletConnectProvider.enable();
  provider = new ethers.providers.Web3Provider(walletConnectProvider);
  signer = provider.getSigner();
  contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
  document.getElementById("player1").innerText = await contract.player1();
  document.getElementById("player2").innerText = await contract.player2();
  document.getElementById("winner").innerText = await contract.winner();
  const state = await contract.state();
  document.getElementById("state").innerText = ["Waiting", "Ready", "Finished"][state];
}

async function joinAsPlayer1() {
  try {
    const tx = await contract.joinAsPlayer1({ value: ethers.utils.parseEther("0.02") });
    await tx.wait();
    alert("Player 1 joined!");
    connectWallet();
  } catch (error) {
    console.error(error);
    alert("Failed to join as Player 1.");
  }
}

async function joinAsPlayer2() {
  try {
    const tx = await contract.joinAsPlayer2({ value: ethers.utils.parseEther("0.02") });
    await tx.wait();
    alert("Player 2 joined!");
    connectWallet();
  } catch (error) {
    console.error(error);
    alert("Failed to join as Player 2.");
  }
}

async function resetDuel() {
  try {
    const tx = await contract.reset();
    await tx.wait();
    alert("Duel has been reset.");
    connectWallet();
  } catch (error) {
    console.error(error);
    alert("Reset failed. Only contract owner can reset.");
  }
}
