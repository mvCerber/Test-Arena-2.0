
const contractAddress = "0x898D5b5F5ef690959dF87399972Db66308D3c02D";
const abi = [/* ABI вставляється вручну на сайті або через окремий файл */];

let provider;
let signer;
let contract;

async function connectWallet() {
    if (window.ethereum) {
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
    const tx = await contract.joinAsPlayer1({ value: ethers.utils.parseEther("0.02") });
    await tx.wait();
    updateStatus();
}

async function joinAsPlayer2() {
    const tx = await contract.joinAsPlayer2({ value: ethers.utils.parseEther("0.02") });
    await tx.wait();
    updateStatus();
}

async function resetDuel() {
    const tx = await contract.reset();
    await tx.wait();
    updateStatus();
}

async function updateStatus() {
    const player1 = await contract.player1();
    const player2 = await contract.player2();
    const winner = await contract.winner();
    const state = await contract.state();
    document.getElementById("status").innerText = `
        Player 1: ${player1}
        Player 2: ${player2}
        Winner: ${winner}
        State: ${["WaitingForPlayer1","WaitingForPlayer2","InProgress","Finished"][state]}
    `;
}
