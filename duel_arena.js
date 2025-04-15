
let contract;
let signer;
let provider;
const contractAddress = "0x898D5b5F5ef690959dF87399972Db66308D3c02D";

async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        signer = provider.getSigner();
        const response = await fetch('duel_arena_abi.json');
        const abi = await response.json();
        contract = new ethers.Contract(contractAddress, abi, signer);
        updateStatus();
    } else {
        alert("Please install MetaMask.");
    }
}

async function joinAsPlayer1() {
    try {
        const tx = await contract.joinAsPlayer1({ value: ethers.utils.parseEther("0.02") });
        await tx.wait();
        updateStatus();
    } catch (err) {
        console.error("Join as Player 1 error:", err);
    }
}

async function joinAsPlayer2() {
    try {
        const tx = await contract.joinAsPlayer2({ value: ethers.utils.parseEther("0.02") });
        await tx.wait();
        updateStatus();
    } catch (err) {
        console.error("Join as Player 2 error:", err);
    }
}

async function resetDuel() {
    try {
        const tx = await contract.reset();
        await tx.wait();
        updateStatus();
    } catch (err) {
        console.error("Reset error:", err);
    }
}

async function updateStatus() {
    try {
        const player1 = await contract.player1();
        const player2 = await contract.player2();
        const winner = await contract.winner();
        const state = await contract.state();

        document.getElementById("player1").innerText = player1;
        document.getElementById("player2").innerText = player2;
        document.getElementById("winner").innerText = winner;

        const states = ["WaitingForPlayer1", "WaitingForPlayer2", "InProgress", "Finished"];
        document.getElementById("state").innerText = states[state];
    } catch (err) {
        console.error("Status update failed:", err);
    }
}
