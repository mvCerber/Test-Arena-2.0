const contractAddress = "0x898D5b5F5ef690959dF87399972Db66308D3c02D";

const abi = [
  {
    "inputs": [{"internalType": "uint64", "name": "subscriptionId", "type": "uint64"}],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "joinAsPlayer1",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "joinAsPlayer2",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "reset",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "player1",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "player2",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "winner",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "state",
    "outputs": [{"internalType": "uint8", "name": "", "type": "uint8"}],
    "stateMutability": "view",
    "type": "function"
  }
];

let provider;
let signer;
let contract;

async function connectWallet() {
    if (typeof window.ethereum !== "undefined") {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        signer = provider.getSigner();
        contract = new ethers.Contract(contractAddress, abi, signer);
        document.getElementById("status").innerText = "Wallet connected";
        updateStatus();
    } else {
        alert("Please install MetaMask");
    }
}

async function joinAsPlayer1() {
    try {
        const tx = await contract.joinAsPlayer1({ value: ethers.utils.parseEther("0.02") });
        await tx.wait();
        updateStatus();
    } catch (error) {
        console.error(error);
    }
}

async function joinAsPlayer2() {
    try {
        const tx = await contract.joinAsPlayer2({ value: ethers.utils.parseEther("0.02") });
        await tx.wait();
        updateStatus();
    } catch (error) {
        console.error(error);
    }
}

async function resetDuel() {
    try {
        const tx = await contract.reset();
        await tx.wait();
        updateStatus();
    } catch (error) {
        console.error(error);
    }
}

async function updateStatus() {
    try {
        const p1 = await contract.player1();
        const p2 = await contract.player2();
        const win = await contract.winner();
        const state = await contract.state();

        const states = ["WaitingForPlayer1", "WaitingForPlayer2", "InProgress", "Finished"];
        document.getElementById("status").innerHTML = `
            <strong>Player 1:</strong> ${p1}<br>
            <strong>Player 2:</strong> ${p2}<br>
            <strong>Winner:</strong> ${win}<br>
            <strong>State:</strong> ${states[state]}
        `;
    } catch (error) {
        console.error("Status update error:", error);
    }
}