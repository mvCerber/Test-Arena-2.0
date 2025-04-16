
let provider, signer, contract, userAddress;
const contractAddress = "0x898D5b5F5ef690959dF87399972Db66308D3c02D";
const abi = [
  {"inputs":[],"name":"joinAsPlayer1","outputs":[],"stateMutability":"payable","type":"function"},
  {"inputs":[],"name":"joinAsPlayer2","outputs":[],"stateMutability":"payable","type":"function"},
  {"inputs":[],"name":"reset","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[],"name":"player1","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"player2","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"winner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"state","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"}
];

async function connectWallet() {
  if (typeof window.ethereum !== "undefined") {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    userAddress = await signer.getAddress();
    document.getElementById("connectedWallet").innerText = "Connected wallet: " + userAddress;
    contract = new ethers.Contract(contractAddress, abi, signer);
    updateStatus();
  } else {
    alert("MetaMask not detected!");
  }
}

async function joinAsPlayer1() {
  try {
    const tx = await contract.joinAsPlayer1({ value: ethers.utils.parseEther("0.02") });
    await tx.wait();
    updateStatus();
  } catch (error) {
    alert("Join as Player 1 failed: " + error.message);
    console.error(error);
  }
}

async function joinAsPlayer2() {
  try {
    const player1 = await contract.player1();
    if (player1.toLowerCase() === userAddress.toLowerCase()) {
      alert("This address is already Player 1. Use another wallet to join as Player 2.");
      return;
    }

    const tx = await contract.joinAsPlayer2({ value: ethers.utils.parseEther("0.02") });
    await tx.wait();
    updateStatus();
  } catch (error) {
    alert("Join as Player 2 failed: " + error.message);
    console.error(error);
  }
}

async function resetDuel() {
  try {
    const tx = await contract.reset();
    await tx.wait();
    updateStatus();
  } catch (error) {
    alert("Reset failed: " + error.message);
    console.error(error);
  }
}

async function updateStatus() {
  try {
    const player1 = await contract.player1();
    const player2 = await contract.player2();
    const winner = await contract.winner();
    const state = await contract.state();

    document.getElementById("player1").innerText = "Player 1: " + player1;
    document.getElementById("player2").innerText = "Player 2: " + player2;
    document.getElementById("winner").innerText = "Winner: " + winner;
    document.getElementById("state").innerText = "State: " + ["WaitingForPlayer1", "WaitingForPlayer2", "InProgress", "Finished"][state];
  } catch (error) {
    console.error("Status update failed:", error);
  }
}
