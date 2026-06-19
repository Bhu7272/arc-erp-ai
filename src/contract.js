import { ethers } from "ethers";

export const contractAddress =
  "0xa3d9Fbd0edB10327ECB73D2C72622E505dF468a2";

export const contractABI = [

  "function storeInvoice(string memory invoiceHash) public",

  "function verifyInvoice(string memory invoiceHash) public view returns (bool)"

];

export async function getContract() {

  if (!window.ethereum) {

    alert("Please install MetaMask");

    return;
  }

  await window.ethereum.request({
    method: "eth_requestAccounts",
  });

  const provider =
    new ethers.BrowserProvider(window.ethereum);

  const signer =
    await provider.getSigner();

  return new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );
}