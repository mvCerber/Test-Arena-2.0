
let provider;
let signer;
let contract;

const CONTRACT_ADDRESS = "0x898D5b5F5ef690959dF87399972Db66308D3c02D";
const ABI = [ /* Встав сюди ABI контракту */ ];

async function connectWallet() {
    if (window.ethereum) {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        signer = provider.getSigner();
        contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
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
    if (!contract) return;
    try {
        const player1 = await contract.player1();
        const player2 = await contract.player2();
        const winner = await contract.winner();
        const state = await contract.state();

        document.getElementById("status").innerHTML = `
            <p>Player 1: ${player1}</p>
            <p>Player 2: ${player2}</p>
            <p>Winner: ${winner}</p>
            <p>State: ${state}</p>
        `;
    } catch (err) {
        console.error("Status update failed:", err);
    }
}
