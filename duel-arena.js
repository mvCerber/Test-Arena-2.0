
let provider;
let signer;
let contract;
let playerAddress;
let contractAddress = "0x898D5b5F5ef690959dF87399972Db66308D3c02D";
let abi;

async function connectWallet() {
    if (window.ethereum) {
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" });
            provider = new ethers.providers.Web3Provider(window.ethereum);
            signer = provider.getSigner();
            playerAddress = await signer.getAddress();
            document.getElementById("status").innerText = "Wallet connected: " + playerAddress;
            if (!abi) {
                const response = await fetch("duel-arena-abi.json");
                abi = await response.json();
            }
            contract = new ethers.Contract(contractAddress, abi, signer);
            updateStatus();
        } catch (error) {
            console.error("Wallet connection failed:", error);
        }
    } else {
        alert("MetaMask not detected. Please install MetaMask.");
    }
}

async function joinAsPlayer1() {
    if (!contract || !signer) {
        alert("Please connect your wallet first.");
        return;
    }
    try {
        const tx = await contract.joinAsPlayer1({ value: ethers.utils.parseEther("0.02") });
        await tx.wait();
        updateStatus();
    } catch (error) {
        console.error("joinAsPlayer1 error:", error);
    }
}

async function joinAsPlayer2() {
    if (!contract || !signer) {
        alert("Please connect your wallet first.");
        return;
    }
    try {
        const tx = await contract.joinAsPlayer2({ value: ethers.utils.parseEther("0.02") });
        await tx.wait();
        updateStatus();
    } catch (error) {
        console.error("joinAsPlayer2 error:", error);
    }
}

async function resetDuel() {
    if (!contract || !signer) {
        alert("Please connect your wallet first.");
        return;
    }
    try {
        const tx = await contract.reset();
        await tx.wait();
        updateStatus();
    } catch (error) {
        console.error("reset error:", error);
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
            <pre>
Player 1: ${player1}
Player 2: ${player2}
Winner: ${winner}
State: ${stateToString(state)}
            </pre>`;
    } catch (error) {
        console.error("updateStatus error:", error);
    }
}

function stateToString(state) {
    const states = ["WaitingForPlayer1", "WaitingForPlayer2", "InProgress", "Finished"];
    return states[state] || "Unknown";
}
