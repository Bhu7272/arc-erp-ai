import arcLogo from "./assets/logo.png";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import jsPDF from "jspdf";
import { useMemo } from "react";
import { getContract } from "./contract";
import {
ResponsiveContainer,
LineChart,
Line,
XAxis,
YAxis,
Tooltip
} from "recharts";
const apiKey =
  import.meta.env.VITE_OPENAI_API_KEY;
const ARC_USDC_ADDRESS =
"0x3600000000000000000000000000000000000000";

export const contractAddress =
"0xa3d9Fbd0edB10327ECB73D2C72622E505dF468a2";
const USDC_ABI = [

"function transfer(address to, uint256 amount) returns (bool)",

"function balanceOf(address owner) view returns (uint256)",

"function decimals() view returns (uint8)",

"function symbol() view returns (string)",

];
const INVOICE_ABI = [

"function storeInvoice(string memory invoiceHash) public",

"function verifyInvoice(string memory invoiceHash) public view returns (bool)"

];
function App() {
  const cashFlowData = [
{ month:"Jan", value:10 },
{ month:"Feb", value:15 },
{ month:"Mar", value:12 },
{ month:"Apr", value:20 }
];

  // Wallet
  const [walletAddress, setWalletAddress] = useState("");
  const [walletBalance, setWalletBalance] =
useState("");

const [networkName, setNetworkName] =
useState("");

  // Invoice
  const [customerName, setCustomerName] = useState("");
  const [receiverWallet, setReceiverWallet] = useState("");
  
  const [vendorName, setVendorName] =
  useState("");

const [vendorWallet, setVendorWallet] =
  useState("");
  const [description, setDescription] = useState("");
const [invoiceMode, setInvoiceMode] =
  useState("purchase");

function generateInvoiceNumber() {

  return `INV-${Date.now()}-${Math.floor(
    Math.random() * 1000
  )}`;
}
const [invoiceNumber, setInvoiceNumber] =
  useState(generateInvoiceNumber());

const [invoiceDate, setInvoiceDate] =
useState(
  new Date().toISOString().split("T")[0]
);

const [quantity, setQuantity] = useState("1");

const [rate, setRate] = useState("");

const [discount, setDiscount] = useState("0");

const [tax, setTax] = useState("0");
const [businessSector, setBusinessSector] =
  useState("office");

const [expenseCategory, setExpenseCategory] =
  useState("");
  // Transaction
  const [txHash, setTxHash] = useState("");
  const [paymentStatus, setPaymentStatus] =
  useState("Pending");
  const [paymentMethod, setPaymentMethod] =
  useState("crypto");

const [dueDate, setDueDate] =
  useState("");

const [notes, setNotes] =
  useState("");
  const [savedInvoices, setSavedInvoices] = useState([]);
  const [activePage, setActivePage] =
useState("dashboard");

const [selectedBank, setSelectedBank] =
useState("");

const [bankAccountNumber,
setBankAccountNumber] =
useState("");

const [ifscCode, setIfscCode] =
useState("");

const [swiftCode, setSwiftCode] =
useState("");

const [bankTransactions,
setBankTransactions] =
useState([]);
  const [companies, setCompanies] =
  useState([]);

const [activeCompany, setActiveCompany] =
  useState("");

const [companyName, setCompanyName] =
  useState("");

const [companySector, setCompanySector] =
  useState("office");
  const subtotal =
  Number(quantity || 0) *
  Number(rate || 0);

const taxAmount =
  (subtotal * Number(tax || 0)) / 100;
  const incomeCategories = {

administrative: [
"Consultancy Income",
"Professional Service Income",
"Commission Income",
"Rental Income",
"Interest Income",
"Training Income",
"Maintenance Service Income",

],

it: [
"Software Development Income",
"Website Development Income",
"Mobile App Development Income",
"SaaS Subscription Income",
"Cloud Service Income",
"API Service Income",
"AI Automation Income",
"ERP Implementation Income",
"AMC Support Income",
"Technical Consultancy Income",
"Digital Marketing Income",
"SEO Service Income",
"Hosting Service Income",
"UI/UX Design Income",
"Freelancing Income",

],

construction: [
"Construction Contract Income",
"Civil Construction Income",
"Labour Contract Income",
"Material Supply Income",
"Interior Design Income",
"Fabrication Income",
"Government Project Income",
"Site Development Income",
"Road Construction Income",
"Building Construction Income",

],

transport: [
"Transport Service Income",
"Freight Income",
"Logistics Income",
"Truck Hire Income",
"Vehicle Rental Income",
"Commission Income",
"Courier Service Income",
"Warehouse Income",
"Fleet Service Income",
"Transport Office Rent",

],

manufacturing: [
"Product Sales",
"Manufacturing Job Work Income",
"Machine Rental Income",
"Export Sales",
"Wholesale Sales",
"Retail Sales",
"Scrap Sales",
"Packaging Income",
"Custom Production Income",

],

retail: [
"Retail Sales",
"Wholesale Sales",
"Online Sales",
"E-Commerce Sales",
"Dealer Commission Income",
"Shop Sales",
"Distribution Income",
"Product Margin Income",

],

web3: [
"Token Sale Income",
"Staking Income",
"Validator Rewards",
"Node Income",
"NFT Sales",
"Smart Contract Development Income",
"Web3 Consultancy Income",
"Blockchain Development Income",
"DAO Treasury Income",
"Airdrop Campaign Revenue",
"Community Management Income",
"Crypto Trading Profit",
"DeFi Yield Income",
"Liquidity Pool Rewards",
"Token Listing Revenue",
"Sponsorship Income",
"Hackathon Prize Income",
"Exchange Partnership Revenue",
"API Subscription Revenue",
"Web3 SaaS Revenue",
"Office Rent",

],

hospitality: [
"Room Rent Income",
"Restaurant Sales",
"Food Delivery Income",
"Catering Income",
"Banquet Booking Income",
"Hotel Service Income",
],

healthcare: [
"Consultation Fees",
"Hospital Service Income",
"Lab Testing Income",
"Medical Service Income",
"Surgery Income",
"Pharmacy Sales",
],

education: [
"Tuition Fees",
"Course Fees",
"Certification Income",
"Training Income",
"Online Class Income",
"Seminar Income",
],

finance: [
"Interest Income",
"Investment Profit",
"Forex Gain",
"Commission Income",
"Loan Processing Income",
],

marketing: [
"Advertising Revenue",
"Brand Promotion Income",
"Sponsorship Revenue",
"Campaign Management Income",
"Social Media Service Income",
],

realestate: [

"Office Rent Income",
"Shop Rent Income",
"Warehouse Rent Income",
"Mall Rental Income",
"Commercial Property Rent",
"Residential Rent Income",
"Lease Rental Income",
"Property Sale Income",
"Land Sale Income",
"Flat Sale Income",
"Brokerage Income",
"Commission Income",
"Parking Rent Income",
"Property Management Income",
"Interior Contract Income",
"Maintenance Income",
"Society Service Income",
"Coworking Space Income",


],

};
const banks = {

india: [

"State Bank of India",
"HDFC Bank",
"ICICI Bank",
"Axis Bank",
"Kotak Mahindra Bank",
"Bank of Baroda",
"Punjab National Bank",
"Canara Bank",
"Union Bank of India",
"IDFC First Bank",

],

usa: [

"JPMorgan Chase",
"Bank of America",
"Wells Fargo",
"Citibank",
"Goldman Sachs",
"Morgan Stanley",
"Capital One",
"PNC Bank",
"US Bank",
"Truist Bank",

],

international: [

"HSBC",
"Standard Chartered",
"Deutsche Bank",
"Barclays",
"BNP Paribas",
"UBS",
"Credit Suisse",
"Santander",
"MUFG Bank",
"DBS Bank",

],

};
const expenseCategories = {

administrative: [
"Office Rent",
"Office Maintenance",
"Electricity Charges",
"Water Charges",
"Internet & WiFi",
"Telephone Expenses",
"Printing & Stationery",
"Software Subscription",
"Cloud Storage Charges",
"Professional Fees",
"Consultancy Charges",
"Legal Fees",
"Audit Fees",
"Government Fees",
"Bank Charges",
"Insurance Expenses",
"Travel Expenses",
"Hotel Expenses",
"Conveyance Expenses",
"Petrol/Diesel Expenses",
"Vehicle Maintenance",
"Parking Charges",
"Staff Welfare Expenses",
"Training Expenses",
"Recruitment Expenses",
"Membership Fees",
"Miscellaneous Expenses",
 
],

it: [
"Software Development Expenses",
"Server Hosting Charges",
"Domain Charges",
"API Subscription",
"SaaS Subscription",
"Cloud Infrastructure Cost",
"AWS/Azure/GCP Charges",
"Cyber Security Expenses",
"VPN Charges",
"UI/UX Design Expenses",
"QA Expenses",
"DevOps Expenses",
"Software License Fees",
"Git Repository Subscription",
"AI Tool Subscription",
"CRM Subscription",
"ERP Subscription",
"Technical Consultancy",
"Freelancer Payments",
"IT Hardware Purchases",
"Laptop Repairs",
"Computer Accessories",
"Digital Marketing Expenses",
"SEO Expenses",
"Paid Ads Expenses",
"Office Rent",
"Coworking Space Rent",
],

construction: [
"Cement Purchase",
"Steel Purchase",
"Sand Purchase",
"Metal Purchase",
"Bricks Purchase",
"RMC Concrete Expenses",
"Tiles Purchase",
"Plumbing Material",
"Electrical Material",
"Paint Material",
"Hardware Material",
"Site Labour Charges",
"Contractor Charges",
"Mason Charges",
"Carpenter Charges",
"Fabrication Charges",
"Welding Charges",
"JCB Rent",
"Crane Hire Charges",
"Excavation Charges",
"Site Transportation",
"Diesel Expenses",
"Site Electricity",
"Architect Fees",
"Structural Consultant Fees",
"Government Approval Fees",
"Municipal Charges",
"Safety Equipment Expenses",
"Construction Equipment Repairs",
"Site Office Rent",
"Godown Rent",
"Warehouse Rent",
],

transport: [
"Diesel Expenses",
"Fuel Expenses",
"FASTag Recharge",
"Toll Expenses",
"Driver Salary",
"Cleaner Salary",
"Vehicle Insurance",
"Vehicle Repair Expenses",
"Tyre Purchase",
"Battery Expenses",
"Engine Oil Expenses",
"GPS Charges",
"Permit Expenses",
"Road Tax",
"Loading Charges",
"Unloading Charges",
"Parking Charges",
"Fleet Maintenance",
"Transport Commission",
"Garage Rent",
"Warehouse Rent",
],

manufacturing: [
"Raw Material Purchase",
"Packing Material",
"Consumable Stores",
"Factory Rent",
"Factory Electricity",
"Generator Diesel",
"Machine Maintenance",
"Plant Repairs",
"Production Labour",
"Supervisor Salary",
"Factory Staff Salary",
"QC Expenses",
"Testing Charges",
"Tooling Expenses",
"Machine AMC",
"Scrap Handling Charges",
"Warehouse Expenses",
"Inventory Loss",
"Production Software",
"Manufacturing Overheads",
"Factory Rent",
"Warehouse Rent",
],

retail: [
"Purchase Expenses",
"Shop Rent",
"Shop Electricity",
"Shop Staff Salary",
"POS Machine Charges",
"Packaging Expenses",
"Delivery Charges",
"Godown Rent",
"Inventory Loss",
"Discount Allowed",
"Sales Promotion Expenses",
"Display Expenses",
"E-Commerce Commission",
"Marketplace Fees",
"Shop Rent",
],

web3: [
"Smart Contract Development",
"Blockchain Audit Fees",
"Token Listing Fees",
"Exchange Listing Charges",
"Community Management Expenses",
"Discord Management",
"Telegram Moderator Salary",
"Influencer Collaboration",
"KOL Marketing",
"Airdrop Campaign Expenses",
"NFT Development Expenses",
"Web3 Developer Salary",
"Node Hosting Charges",
"Validator Expenses",
"Gas Fees",
"Wallet Security Expenses",
"Crypto Transaction Fees",
"DAO Management Expenses",
"Token Liquidity Expenses",
"Staking Reward Expenses",
"Bug Bounty Expenses",
"Web3 Marketing",
"Twitter/X Promotion",
"Zealy Campaign Expenses",
"Galxe Campaign Expenses",
"Smart Contract Testing",
"Wallet Integration Charges",
"API Node Subscription",
"CoinMarketCap Listing Fees",
"CoinGecko Listing Expenses",
"Hackathon Sponsorship",
"Ambassador Program Expenses",
"Coworking Space Rent",
"Studio Rent",
],

realestate: [

"Property Purchase",
"Land Purchase",
"Flat Purchase",
"Office Rent",
"Warehouse Rent",
"Mall Maintenance",
"Society Charges",
"Property Tax",
"Registration Charges",
"Stamp Duty",
"Brokerage Expenses",
"Interior Expenses",
"Furniture Expenses",
"Electricity Charges",
"Water Charges",
"Security Expenses",
"Housekeeping Expenses",
"Lift Maintenance",
"Parking Maintenance",
"Property Insurance",
"Repair & Maintenance",
"Painting Expenses",
"Legal Fees",
"Architect Fees",
"Consultancy Charges",
"Office Rent",
"Commercial Space Rent",
"Office Rent",
"Commercial Space Rent",
],

};

const finalAmount =
  subtotal -
  Number(discount || 0) +
  taxAmount;


  function getAccountType(
  category,
  invoiceMode
) {

  const expenseAccounts = [
    "Employee Salary",
    "Office Rent",
    "Electricity Bill",
    "Internet Charges",
    "Software Subscription",
    "Bank Charges",
    "Advertisement Expenses",
    "Fuel Expenses",
    "Driver Salary",
    "Site Labour Wages",
    "Web3 Developer Salary",
  ];

 const fixedAssetAccounts = [

"Building",
"Office Building",
"Factory Building",
"Warehouse Building",
"Shop Property",
"Commercial Property",

"Furniture",
"Office Furniture",
"Interior Decoration",

"Computer",
"Laptop",
"Printer",
"Server Machine",

"Vehicle",
"Truck",
"Car",
"Transport Vehicle",
"Construction Vehicle",

"Plant & Machinery",
"Heavy Machinery",
"Construction Equipment",

"Land",
"Office Land",
"Industrial Land",

"Electrical Equipment",
"Generator",
"Air Conditioner",

];
const assetAccounts = [

...fixedAssetAccounts,

/* Cash & Bank */

"Cash in Hand",
"Petty Cash",
"Cash at Bank",
"Current Account Balance",
"Savings Account Balance",
"Fixed Deposit (Short Term)",
"Margin Money Deposit",
"UPI Balance",
"Online Wallet Balance",
"Foreign Currency Balance",

/* Receivables */

"Sundry Debtors",
"Trade Receivables",
"Customer Outstanding",
"Bill Receivable",
"Retention Receivable",
"Export Receivables",
"Outstanding Service Income",
"Outstanding Freight Charges",
"Outstanding Rent Receivable",

/* Inventory */

"General Inventory",
"Closing Stock",
"Raw Material Stock",
"Finished Goods Stock",
"Semi-Finished Goods",
"Work-in-Progress (WIP)",
"Packing Material Stock",
"Consumable Stores",
"Spare Parts Inventory",
"Warehouse Stock",
"Shop Inventory",
"Construction WIP",
"Production Material Stock",

/* Loans & Advances */

"Advance to Suppliers",
"Employee Advance",
"Salary Advance",
"Contractor Advance",
"Site Advance",
"Security Deposit Recoverable",
"Advance Rent",
"Advance Insurance",
"Advance Tax",
"Vendor Deposit",
"Loan to Staff",
"Travel Advance",

/* GST & Tax Assets */

"Input CGST",
"Input SGST",
"Input IGST",
"Input Cess",
"TDS Receivable",
"GST Refund Receivable",
"Income Tax Refund Receivable",

/* Investments */

"Mutual Fund Investments",
"Liquid Fund Investments",
"Share Market Investments",
"Crypto Investments",
"Government Securities",

/* IT Assets */

"Software License Receivable",
"SaaS Subscription Receivable",
"Cloud Credit Balance",
"API Credit Balance",
"Hosting Credit",
"Digital Wallet Balance",
"Client Project WIP",
"Unbilled Revenue",

/* Construction Assets */

"Running Bill Receivable",
"Retention Money Receivable",
"Material at Site",
"Tender Deposit Recoverable",
"Contract Asset",
"Work Certified but Not Billed",

/* Transport Assets */

"Freight Receivable",
"Diesel Stock",
"Toll FASTag Balance",
"Trip Advance Recoverable",
"Fuel Card Balance",

/* Manufacturing Assets */

"Production WIP",
"Factory Inventory",
"Goods Under Inspection",
"Consumable Inventory",
"Packing Inventory",

/* Web3 Assets */

"Crypto Wallet Balance",
"Stablecoin Holdings",
"Exchange Wallet Balance",
"Token Inventory",
"NFT Holdings",
"Staking Rewards Receivable",
"Node Rewards Receivable",
"DAO Treasury Balance",
"Web3 Grant Receivable",
"Airdrop Receivable",
"Smart Contract Deposit",
"Gas Fee Wallet Balance",

/* Retail Assets */

"Marketplace Receivable",
"COD Receivable",
"E-Commerce Wallet Balance",
"Returned Goods Inventory",

/* Healthcare Assets */

"Pharmacy Stock",
"Medical Consumables",
"Insurance Claim Receivable",
"Patient Receivable",

/* Hospitality Assets */

"Guest Receivable",
"Kitchen Stock",
"Beverage Stock",

/* Education Assets */

"Student Fees Receivable",
"Hostel Fees Receivable",

/* Misc */

"Prepaid Expenses",
"Accrued Income",
"Earnest Money Deposit",
"Recoverable Expenses",
"Insurance Claim Receivable",
"Temporary Deposits",

];

  const inventoryAccounts = [
    "Raw Material Purchase",
    "Product Purchase",
    "Packaging Material",
  ];

  const liabilityAccounts = [
    "Loan EMI",
    "Bank Loan",
  ];

  // SALES ENTRY
  if (invoiceMode === "sales") {
    return "Revenue";
  }

  // PURCHASE ENTRY
  if (
    expenseAccounts.includes(category)
  ) {
    return "Profit & Loss";
  }
if (
fixedAssetAccounts.includes(category)
) {
return "Fixed Asset";
}
  if (
    assetAccounts.includes(category)
  ) {
    return "Balance Sheet Asset";
  }

  if (
    inventoryAccounts.includes(category)
  ) {
    return "Inventory Asset";
  }

  if (
    liabilityAccounts.includes(category)
  ) {
    return "Liability";
  }

  return "General Expense";
}
  useEffect(() => {

  const storedInvoices =
    localStorage.getItem("arcInvoices");

  if (storedInvoices) {

    setSavedInvoices(
      JSON.parse(storedInvoices)
    );
  }

}, []);

useEffect(() => {

  const storedCompanies =
  
    localStorage.getItem(
      "arcCompanies"
    );

  if (storedCompanies) {

    const parsedCompanies =
      JSON.parse(storedCompanies);

    setCompanies(parsedCompanies);

    if (
      parsedCompanies.length > 0
    ) {

      setActiveCompany(
        parsedCompanies[0].name
      );
    }
  }

}, []);
useEffect(() => {

  const storedBanks =
    localStorage.getItem(
      "arcBanks"
    );

  if (storedBanks) {

    setBankTransactions(
      JSON.parse(storedBanks)
    );

  }

}, []);
useEffect(() => {

  if (
    walletAddress &&
    invoiceMode === "sales"
  ) {

    setReceiverWallet(walletAddress);

  }

}, [walletAddress, invoiceMode]);

  // Connect Wallet
  async function connectWallet() {


try {

if (!window.ethereum) {

alert("Install MetaMask");

return;

}

const accounts =
await window.ethereum.request({

method: "eth_requestAccounts",

});

setWalletAddress(accounts[0]);
const provider =
new ethers.BrowserProvider(
window.ethereum
);

const network =
await provider.getNetwork();

console.log(
"CHAIN ID:",
network.chainId.toString()
);

setNetworkName(
"ARC Testnet"
);
const usdcContract =
new ethers.Contract(

ARC_USDC_ADDRESS,

USDC_ABI,

provider

);

const balance =
await usdcContract.balanceOf(
accounts[0]
);

setWalletBalance(
ethers.formatUnits(balance, 6)
);
alert("Wallet Connected");

} catch (error) {

console.log(error);

alert("Wallet Connection Failed");

}

}
  // Payment
  function saveCompany() {

  if (!companyName) {

    alert("Enter Company Name");

    return;
  }

  const newCompany = {

    name: companyName,

    sector: companySector,
  };

  const updatedCompanies = [

    ...companies,

    newCompany,
  ];

  setCompanies(updatedCompanies);

  localStorage.setItem(
    "arcCompanies",
    JSON.stringify(updatedCompanies)
  );

  setActiveCompany(companyName);

  alert("Company Created");

  setCompanyName("");
}
async function saveInvoice() {
if (!description) {

  alert("Enter Description");

  return;

}

if (!expenseCategory) {

  alert("Select Category");

  return;

}

if (!rate || Number(rate) <= 0) {

  alert("Enter Valid Rate");

  return;

}

if (!quantity || Number(quantity) <= 0) {

  alert("Enter Valid Quantity");

  return;

}
  const invoiceData = {

company: activeCompany,
invoiceMode,
customerName,
receiverWallet,
vendorName,
vendorWallet,
description,
businessSector,
expenseCategory,
invoiceNumber,
invoiceDate,
quantity,
rate,
discount,
tax,
subtotal,
amount: finalAmount,
txHash,
paymentStatus,
paymentMethod,
dueDate,
notes,

};

const invoiceString =
JSON.stringify(invoiceData);

const invoiceHash =
ethers.keccak256(
ethers.toUtf8Bytes(invoiceString)
);

const contract = await getContract();

await contract.storeInvoice(invoiceHash);

alert("Invoice stored on blockchain");
const newInvoice = {
    company: activeCompany,
invoiceMode,
 customerName,
receiverWallet,
vendorName,
vendorWallet,
description,
businessSector,
expenseCategory,
accountType:
  getAccountType(
    expenseCategory,
    invoiceMode
  ),

invoiceNumber,
invoiceDate,

quantity,
rate,
discount,
tax,

subtotal,
amount: finalAmount,

txHash,
paymentStatus,
paymentMethod,
dueDate,
notes,
invoiceHash,

blockchainTx: txHash,
  };


  const updatedInvoices = [
    ...savedInvoices,
    newInvoice,
  ];

  setSavedInvoices(updatedInvoices);

  localStorage.setItem(
    "arcInvoices",
    JSON.stringify(updatedInvoices)
  );

  alert("Invoice Saved");
  setCustomerName("");
setReceiverWallet("");
setVendorName("");
setVendorWallet("");
setDescription("");
setQuantity("1");
setRate("");
setDiscount("0");
setTax("0");
setExpenseCategory("");
setTxHash("");
setPaymentStatus("Pending");
setInvoiceNumber(
  generateInvoiceNumber()
);
}
 async function payNow() {

try {

if (!window.ethereum) {

alert("Install MetaMask");

return;

}

const paymentWallet =
invoiceMode === "purchase"
? vendorWallet
: receiverWallet;

if (
!paymentWallet ||
!ethers.isAddress(paymentWallet)
) {

alert("Invalid wallet");

return;

}

if (!finalAmount || finalAmount <= 0) {

alert("Invalid Amount");

return;

}

const provider =
new ethers.BrowserProvider(
window.ethereum
);

const signer =
await provider.getSigner();

const signerAddress =
await signer.getAddress();

console.log(
  "Connected:",
  signerAddress
);

const usdcContract =
new ethers.Contract(

ARC_USDC_ADDRESS,

USDC_ABI,

signer

);
console.log(
  "Sending Amount:",
  finalAmount
);

console.log(
  "Parsed Amount:",
  ethers.parseUnits(
    finalAmount.toString(),
    6
  ).toString()
);
const tx =
await usdcContract.transfer(

paymentWallet,

ethers.parseUnits(
finalAmount.toString(),
6
)

);

setPaymentStatus("Processing");

await tx.wait();

setTxHash(tx.hash);

setPaymentStatus("Paid");

const paidInvoice = {
  company: activeCompany,
  invoiceMode,
  vendorName,
  vendorWallet,
  description,
  businessSector,
  expenseCategory,

  accountType: getAccountType(
    expenseCategory,
    invoiceMode
  ),

  invoiceNumber,
  invoiceDate,

  quantity,
  rate,
  discount,
  tax,

  subtotal,
  amount: finalAmount,

  txHash: tx.hash,

  paymentStatus: "Paid",

  paymentMethod: "USDC",

  debitAccount:
    expenseCategory,

  creditAccount: "USDC Wallet",

walletImpact: -finalAmount,
};

const updatedInvoices = [
  ...savedInvoices,
  paidInvoice
];
let ledgerEntry = [];

if (invoiceMode === "purchase") {

ledgerEntry = [
  {
    company: activeCompany,
    type: "DEBIT",
    account: "USDC Wallet",
    amount: finalAmount
  },
  {
    company: activeCompany,
    type: "CREDIT",
    account: "Revenue",
    amount: finalAmount
  }
];

} else {

  ledgerEntry = [
    {
      type: "DEBIT",
      account: "USDC Wallet",
      amount: finalAmount
    },
    {
      type: "CREDIT",
      account: "Revenue",
      amount: finalAmount
    }
  ];

}
const existingLedger =
JSON.parse(
  localStorage.getItem("arcLedger")
) || [];

const updatedLedger = [
  ...existingLedger,
  ...ledgerEntry
];

localStorage.setItem(
  "arcLedger",
  JSON.stringify(updatedLedger)
);
setSavedInvoices(updatedInvoices);

localStorage.setItem(
  "arcInvoices",
  JSON.stringify(updatedInvoices)
);

alert("USDC Payment Successful");

} catch (error) {

console.log(error);

alert(
error.reason ||
error.message ||
"Payment Failed"
);

}

}

  // Download PDF
 function deleteInvoice(invoiceHash) {

  const updatedInvoices =
    savedInvoices.filter(
      invoice =>
        invoice.invoiceHash !== invoiceHash
    );

  setSavedInvoices(updatedInvoices);

  localStorage.setItem(
    "arcInvoices",
    JSON.stringify(updatedInvoices)
  );
}
  function downloadPDF() {

    const doc = new jsPDF();

    doc.setFontSize(22);

    doc.text("ARC ERP AI", 20, 20);

    doc.setFontSize(16);

    doc.text("Invoice", 20, 40);

    doc.setFontSize(12);

doc.text(
  invoiceMode === "purchase"
    ? `Vendor: ${vendorName}`
    : `Customer: ${customerName}`,
  20,
  60
);

    doc.text(
  invoiceMode === "purchase"
    ? `Vendor Wallet: ${vendorWallet}`
    : `Customer Wallet: ${receiverWallet}`,
  20,
  75
);

    doc.text(`Description: ${description}`, 20, 90);

    doc.text(`Amount: ${finalAmount} USDC`, 20, 105);

    if (txHash) {

      doc.text(`Transaction: ${txHash}`, 20, 120);

    }

    doc.save("invoice.pdf");
  }

  // Share Link
  const companyInvoices =
savedInvoices.filter(
  invoice =>
    invoice.company === activeCompany
);
  const totalRevenue =
  companyInvoices
    .filter(
      invoice =>
        invoice.accountType === "Revenue"
    )
    .reduce(
      (total, invoice) =>
        total + Number(invoice.amount || 0),
      0
    );

const accountsReceivable =
  companyInvoices
    .filter(
      inv =>
        inv.invoiceMode === "sales" &&
        inv.paymentStatus !== "Paid"
    )
    .reduce(
      (sum, inv) =>
        sum + Number(inv.amount || 0),
      0
    );

const accountsPayable =
  companyInvoices
    .filter(
      inv =>
        inv.invoiceMode === "purchase" &&
        inv.paymentStatus !== "Paid"
    )
    .reduce(
      (sum, inv) =>
        sum + Number(inv.amount || 0),
      0
    );
const totalExpenses =
  companyInvoices
    .filter(
      (invoice) =>
        invoice.accountType ===
        "Profit & Loss"
    )
    .reduce(
      (total, invoice) =>
        total +
        Number(invoice.amount || 0),
      0
    );

const totalAssets =
  companyInvoices
    .filter(
      (invoice) =>
        invoice.accountType ===
        "Balance Sheet Asset"
    )
    .reduce(
      (total, invoice) =>
        total +
        Number(invoice.amount || 0),
      0
    );

const walletAsset =
  Number(walletBalance || 0);
  const walletHealth =
  Number(walletBalance) > 100
    ? "Healthy"
    : "Low Balance";
  const totalWalletSpent =
  companyInvoices
    .filter(
      invoice =>
        invoice.creditAccount ===
        "USDC Wallet"
    )
    .reduce(
      (total, invoice) =>
        total +
        Number(invoice.amount || 0),
      0
    );

const totalInventory =
  companyInvoices
    .filter(
      (invoice) =>
        invoice.accountType ===
        "Inventory Asset"
    )
    .reduce(
      (total, invoice) =>
        total +
        Number(invoice.amount || 0),
      0
    );
    const ledger =
JSON.parse(
  localStorage.getItem("arcLedger")
) || [];
const companyLedger =
  ledger.filter(
    entry =>
      entry.company === activeCompany
  );
  const companyBanks =
  bankTransactions.filter(
    bank =>
      bank.company === activeCompany
  ).reverse();
const walletCredits =
companyLedger
.filter(
  entry =>
    entry.account ===
    "USDC Wallet"
)
.reduce(
  (sum, entry) =>
    sum + Number(entry.amount),
  0
);

const erpWalletBalance =
Math.max(
  0,
  walletAsset - walletCredits
);

const paidInvoices =
  companyInvoices.filter(
    i => i.paymentStatus === "Paid"
  ).length;

const unpaidInvoices =
  companyInvoices.filter(
    i => i.paymentStatus !== "Paid"
  ).length;
  
const totalLiabilities =
  companyInvoices
     
  .filter(
      (invoice) =>
        invoice.accountType ===
        "Liability"
    )

    .reduce(
      (total, invoice) =>
        total +
        Number(invoice.amount || 0),
      0
    );
 const totalDebits =
  companyLedger
    .filter(
      entry => entry.type === "DEBIT"
    )
    .reduce(
      (sum, entry) =>
        sum + Number(entry.amount || 0),
      0
    );

const totalCredits =
  companyLedger
    .filter(
      entry => entry.type === "CREDIT"
    )
    .reduce(
      (sum, entry) =>
        sum + Number(entry.amount || 0),
      0
    );

const booksStatus =
  totalDebits === totalCredits
    ? "Balanced"
    : "Mismatch";
    
    const netProfit =
  totalRevenue - totalExpenses;
  const cashFlow =
  totalRevenue - totalExpenses;
  const queryParams =
new URLSearchParams(
  window.location.search
);

const invoiceParam =
  queryParams.get("invoice");

const sharedInvoice =
  useMemo(() => {

    if (!invoiceParam)
      return null;

    try {

      return JSON.parse(
        decodeURIComponent(
          invoiceParam
        )
      );

    } catch {

      return null;

    }

  }, [invoiceParam]);
// Styles
const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "15px",
};

const buttonStyle = {
  padding: "12px 20px",
  marginRight: "10px",
};

  return (
<div className="app-container">

  <div className="main-card">

    <div className="topbar">

      <div className="logo-section">

        <img
          src={arcLogo}
          alt="ARC"
        />

        <div className="logo-title">
          ARC ERP AI
          <div className="quick-actions">

<button>
+ Invoice
</button>

<button>
+ Customer
</button>

<button>
+ Payment
</button>

<button>
+ Company
</button>
<button
  onClick={() =>
    window.open(
      "https://faucet.circle.com/",
      "_blank"
    )
  }
>
  🚰 Faucet
</button>
</div>

</div>

</div>

<div className="menu-buttons">
 {walletAddress ? (

<button
onClick={() => {

setWalletAddress("");

alert("Wallet Disconnected");

}}
>

Disconnect Wallet

</button>

) : (

<button onClick={connectWallet}>

Connect Wallet

</button>

)}
        <button
  onClick={() =>
    setActivePage("dashboard")
  }
>
  Dashboard
</button>

<button
  onClick={() =>
    setActivePage("create")
  }
>
  Create Invoice
</button>

<button
  onClick={() =>
    setActivePage("history")
  }
>
  Invoice History
</button>
<button
  onClick={() =>
    setActivePage("accounts")
  }
>
  Accounts
</button>
<button
onClick={() =>
setActivePage("banking")
}
>
Banking
</button>
<button
onClick={() =>
setActivePage("balancesheet")
}
>
Balance Sheet
</button>
<button
  onClick={() =>
    setActivePage("profit")
  }
>
  Profit & Loss
</button>
<button
  onClick={() =>
    setActivePage("company")
  }
>
  Create Company
</button>

<button
  onClick={() =>
    setActivePage("ledger")
  }
>
  Ledger
</button> 
<button
  onClick={() =>
    setActivePage("treasury")
  }
>
  Treasury
</button>
      </div>

    </div>
  
<div className="content-area">


      <br />

     <p>
  {walletAddress
    ? walletAddress
    : "Wallet Not Connected"}
</p>

<p>
  <strong>Network:</strong>{" "}
  {networkName || "Not Connected"}
</p>

<p>
  <strong>Wallet Balance:</strong>{" "}
  {walletBalance
    ? Number(walletBalance).toFixed(4)
    : "0"} USDC
</p>

<div style={{ marginBottom: "20px" }}>

<p>
  <strong>Active Company:</strong>
</p>

<select
  value={activeCompany}
  onChange={(e) =>
    setActiveCompany(
      e.target.value
    )
  }
  style={{
    padding: "10px",
    width: "300px"
  }}
>

<option value="">
Select Company
</option>

{companies.map(
(company, index) => (

<option
key={index}
value={company.name}
>
{company.name}
</option>

))
}

</select>

</div>
{activePage === "dashboard" && (

<>

<h2>ERP Dashboard</h2>
<div
  style={{
    padding: "20px",
    borderRadius: "20px",
    marginBottom: "20px",
    background:
      "linear-gradient(135deg,#0f172a,#1e3a8a,#06b6d4)"
  }}
>
  <h1
    style={{
      margin: 0,
      color: "white"
    }}
  >
    ARC ERP AI
  </h1>

  <p
    style={{
      color: "#cbd5e1"
    }}
  >
    The Financial Operating System for Web3 Businesses
  </p>
</div>
<div
  style={{
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(250px,1fr))",
    gap: "20px",
    marginBottom: "30px",
  }}
>

 <div className="dashboard-card">

<div
 style={{
  color:"#94a3b8"
 }}
>
 Revenue
</div>

<h1>
 {totalRevenue.toFixed(2)}
</h1>

<p>USDC</p>

</div>

  <div className="dashboard-card">
    <div
 style={{
  color:"#94a3b8"
 }}
>
 Expenses
</div>

    <h1>
 {totalExpenses.toFixed(2)}
</h1>

<p>USDC</p>
  </div>

  <div className="dashboard-card">
    <div
 style={{
  color:"#94a3b8"
 }}
>
 Assets
</div>

<h1>
 {totalAssets.toFixed(2)}
</h1>

<p>USDC</p>
  </div>

  <div className="dashboard-card">
    <div
 style={{
  color:"#94a3b8"
 }}
>
 Inventory
</div>

<h1>
 {totalInventory.toFixed(2)}
</h1>

<p>USDC</p>
  </div>

  <div className="dashboard-card">
    <div
 style={{
  color:"#94a3b8"
 }}
>
 Liabilities
</div>

   <h1>
 {totalLiabilities.toFixed(2)}
</h1>

<p>USDC</p>
  </div>

  <div className="dashboard-card">

<div
style={{color:"#94a3b8"}}
>
Receivables
</div>

<h1>
{accountsReceivable.toFixed(2)}
</h1>

<p>USDC</p>

</div>

<div className="dashboard-card">

  <div
    style={{
      color:"#94a3b8"
    }}
  >
    Wallet
  </div>

  <h1>
    {erpWalletBalance.toFixed(2)}
  </h1>

  <p>USDC</p>

</div>

<div className="dashboard-card">
  <h3>Wallet Health</h3>

  <h2>
    {walletHealth}
  </h2>
</div>
<div className="dashboard-card">

  <div
    style={{
      color:"#94a3b8"
    }}
  >
    Treasury
  </div>

  <h1>
    3
  </h1>

  <p>
    Services Ready
  </p>

  <p>🟢 Bridge</p>

  <p>🟢 Swap</p>

  <p>🟢 Unified Balance</p>

</div>
<div className="dashboard-card">

  <div
    style={{
      color:"#94a3b8"
    }}
  >
    Payables
  </div>

  <h1>
    {accountsPayable.toFixed(2)}
  </h1>

  <p>USDC</p>

</div>
<div className="dashboard-card">
  <h3>Net Cash Flow</h3>
 <h2
  style={{
    color:
      cashFlow >= 0
      ? "#22c55e"
      : "#ef4444"
  }}
  
>
  {cashFlow.toFixed(2)} USDC
</h2>
</div>
<div className="dashboard-card">
  <h3>Total Invoices</h3>
  <h2>{companyInvoices.length}</h2>
</div>
<div className="dashboard-card">
  <h3>Paid Invoices</h3>
  <h2>{paidInvoices}</h2>
</div>

<div className="dashboard-card">
  <h3>Unpaid Invoices</h3>
  <h2>{unpaidInvoices}</h2>
</div>
<div className="dashboard-card">
<h3>
Working Capital
</h3>

<h1>
{
(
accountsReceivable -
accountsPayable
).toFixed(2)
}
</h1>

<p>
USDC
</p>
</div>
<div className="dashboard-card">

<h3>
AI Insight
</h3>

<p>
Profit:
{netProfit.toFixed(2)} USDC
</p>

<p>
Unpaid Invoices:
{unpaidInvoices}
</p>

<p>
Recommendation:
Collect pending invoices.
</p>
</div>
<div className="dashboard-card">

<h3>
App Kit Status
</h3>

<p>
🟢 Send Ready
</p>

<p>
🟢 Bridge Ready
</p>

<p>
🟢 Swap Ready
</p>

<p>
🟢 Unified Balance Ready
</p>

</div>
<div className="dashboard-card">


<h3>Cash Flow Trend</h3>

<ResponsiveContainer
  width="100%"
  height={250}
>
  <LineChart data={cashFlowData}>
    <XAxis dataKey="month" />
    <YAxis />
    <Tooltip />
    <Line
      type="monotone"
      dataKey="value"
    />
  </LineChart>
</ResponsiveContainer>

</div>

  <div className="dashboard-card">
  <h3>Recent Transactions</h3>
<div className="ticker">
 {companyInvoices
  .slice()
    .reverse()
    .slice(0,5)
    .map((invoice,index) => (
      <span key={index}>
        {invoice.invoiceNumber}
        • {Number(invoice.amount || 0).toFixed(2)} USDC
        • {invoice.paymentStatus || "Pending"}
        &nbsp;&nbsp;&nbsp;&nbsp;
      </span>
    ))
  }
</div>

</div>

</div>

</>

)}
      <hr />
{activePage === "create" && (
<>

<h2>Create Invoice</h2>

<select
  value={invoiceMode}
  onChange={(e) =>
    setInvoiceMode(e.target.value)
  }
  style={inputStyle}
>
  <option value="sales">
    Sales Invoice
  </option>

  <option value="purchase">
    Purchase Invoice
  </option>
</select>

{invoiceMode === "sales" ? (

<>

<input
  type="text"
  placeholder="Customer Name"
  value={customerName}
  onChange={(e) =>
    setCustomerName(e.target.value)
  }
  style={inputStyle}
/>

<input
  type="text"
  placeholder="Customer Wallet"
  value={receiverWallet}
  onChange={(e) =>
    setReceiverWallet(e.target.value)
  }
  style={inputStyle}
/>

</>

) : (

<>

<input
  type="text"
  placeholder="Vendor Name"
  value={vendorName}
  onChange={(e) =>
    setVendorName(e.target.value)
  }
  style={inputStyle}
/>

<input
  type="text"
  placeholder="Vendor Wallet"
  value={vendorWallet}
  onChange={(e) =>
    setVendorWallet(e.target.value)
  }
  style={inputStyle}
/>

</>

)}

<textarea
  placeholder="Description"
  value={description}
  onChange={(e) =>
    setDescription(e.target.value)
  }
  style={inputStyle}
/>

<p>
  Company Sector:
  {
    companies.find(
      c => c.name === activeCompany
    )?.sector || "No Sector"
  }
</p>
<select
  value={expenseCategory}
  onChange={(e) =>
    setExpenseCategory(
      e.target.value
    )
  }
  style={inputStyle}
>

<option value="">
  Select Category
</option>

{(
invoiceMode === "sales"
? incomeCategories[
    companies.find(
      c => c.name === activeCompany
    )?.sector
  ]
: expenseCategories[
    companies.find(
      c => c.name === activeCompany
    )?.sector
  ]
)?.map((item) => (

<option
  key={item}
  value={item}
>
  {item}
</option>

))}

</select>

<input
  type="number"
  placeholder="Quantity"
  value={quantity}
  onChange={(e) =>
    setQuantity(e.target.value)
  }
  style={inputStyle}
/>

<input
  type="number"
  placeholder="Rate in USDC"
  value={rate}
  onChange={(e) =>
    setRate(e.target.value)
  }
  style={inputStyle}
/>

<input
  type="number"
  placeholder="Discount"
  value={discount}
  onChange={(e) =>
    setDiscount(e.target.value)
  }
  style={inputStyle}
/>

<input
  type="number"
  placeholder="Tax %"
  value={tax}
  onChange={(e) =>
    setTax(e.target.value)
  }
  style={inputStyle}
/>

<h3>
  Total:
  {finalAmount.toFixed(2)}
  USDC
</h3>

<button
  onClick={saveInvoice}
  style={buttonStyle}
>
  Save Invoice
</button>

{invoiceMode === "purchase" ? (

<button
  onClick={payNow}
  style={buttonStyle}
>
  Pay Vendor
</button>

) : (

<button
  style={buttonStyle}
  onClick={() => {

if (
  !receiverWallet ||
  !ethers.isAddress(receiverWallet)
) {
  alert("Invalid Customer Wallet");
  return;
}
    const invoiceData = {
      customerName,
      receiverWallet,
      amount: finalAmount,
      description,
      invoiceNumber,
      invoiceDate,
      invoiceMode: "sales",
      expenseCategory,
      businessSector,
      accountType: "Revenue",
    };

    const encoded =
      encodeURIComponent(
        JSON.stringify(invoiceData)
      );

    const invoiceLink =
      `${window.location.origin}/?invoice=${encoded}`;

    navigator.clipboard.writeText(
      invoiceLink
    );

    alert(
      "Invoice payment link copied!"
    );

  }}
>
  Share Invoice Link
</button>

)}

<button
  onClick={downloadPDF}
  style={buttonStyle}
>
  Download PDF
</button>

</>
)}

{activePage === "company" && (

<>

<h2>Create Company</h2>

<input
  type="text"
  placeholder="Company Name"
  value={companyName}
  onChange={(e) =>
    setCompanyName(
      e.target.value
    )
  }
  style={inputStyle}
/>

<select
  value={companySector}
  onChange={(e) =>
    setCompanySector(
      e.target.value
    )
  }
  style={inputStyle}
>

<option value="office">
  Office
</option>

<option value="construction">
  Construction
</option>

<option value="transport">
  Transport
</option>

<option value="manufacturing">
  Manufacturing
</option>

<option value="retail">
  Retail
</option>

<option value="it">
  IT
</option>
<option value="web3">
  Web3 & Blockchain
</option>

<option value="realestate">
  Real Estate
</option>

</select>

<button
  onClick={saveCompany}
  style={buttonStyle}
>
  Save Company
</button>

<br /><br />

<h3>
  Company List
</h3>

{companies.map(
  (company, index) => (

<div
  key={index}
  style={{
    border:
      "1px solid gray",
    padding: "15px",
    marginBottom: "10px",
    borderRadius: "10px",
    backgroundColor:
      "#f9f9f9",
    color: "black",
  }}
>

<h4>
  {company.name}
</h4>

<p>
  Sector:
  {" "}
  {company.sector}
</p>

<button
  onClick={() =>
    setActiveCompany(
      company.name
    )
  }
>
  Select Company
</button>

</div>

))}

</>

)}

    {activePage === "history" && (
<>
<h2>Saved Invoices</h2>

<div className="saved-invoices-container">

{companyInvoices.map((invoice) => (

<div
  key={invoice.invoiceHash}
  style={{
    border: "1px solid gray",
    padding: "20px",
    marginBottom: "20px",
    borderRadius: "10px",
    backgroundColor: "#f9f9f9",
    color: "black",
  }}
>

<p>
<strong>Company:</strong>
{" "}
{invoice.company}
</p>

<p>
<strong>Invoice No:</strong>
{" "}
{invoice.invoiceNumber}
</p>

<p>
<strong>Date:</strong>
{" "}
{invoice.invoiceDate}
</p>

<p>
<strong>
{invoice.invoiceMode === "purchase"
? "Vendor:"
: "Customer:"}
</strong>

{" "}

{invoice.invoiceMode === "purchase"
? invoice.vendorName
: invoice.customerName}
</p>

<p>
<strong>Sector:</strong>
{" "}
{invoice.businessSector}
</p>

<p>
<strong>Category:</strong>
{" "}
{invoice.expenseCategory}
</p>

<p>
<strong>Accounting Type:</strong>
{" "}
{invoice.accountType}
</p>

<p>
<strong>Status:</strong>
{" "}
{invoice.paymentStatus || "Pending"}
</p>

<p>
<strong>Total Amount:</strong>
{" "}
{invoice.amount || 0} USDC
</p>

<button
onClick={() =>
  deleteInvoice(invoice.invoiceHash)
}
style={buttonStyle}
>
Delete
</button>

</div>

))}

</div>

</>
)}
  {activePage === "banking" && (

<>

<h2>Banking System</h2>

<select
value={selectedBank}
onChange={(e) =>
setSelectedBank(e.target.value)
}
style={inputStyle}
>

<option value="">
Select Bank
</option>

{/* India */}

<option disabled>
--- Indian Banks ---
</option>

{banks.india.map((bank, index) => (

<option
key={index}
value={bank}
>
{bank}
</option>

))}

{/* USA */}

<option disabled>
--- USA Banks ---
</option>

{banks.usa.map((bank, index) => (

<option
key={index}
value={bank}
>
{bank}
</option>

))}

{/* International */}

<option disabled>
--- International Banks ---
</option>

{banks.international.map(
(bank, index) => (

<option
key={index}
value={bank}
>
{bank}
</option>

))
}

</select>

<input
type="text"
placeholder="Bank Account Number"
value={bankAccountNumber}
onChange={(e) =>
setBankAccountNumber(
e.target.value
)
}
style={inputStyle}
/>

<input
type="text"
placeholder="IFSC Code"
value={ifscCode}
onChange={(e) =>
setIfscCode(e.target.value)
}
style={inputStyle}
/>

<input
type="text"
placeholder="SWIFT Code"
value={swiftCode}
onChange={(e) =>
setSwiftCode(e.target.value)
}
style={inputStyle}
/>

<button
style={buttonStyle}
onClick={() => {
  

const newBank = {

company: activeCompany,

bank: selectedBank,

accountNumber:
bankAccountNumber,

ifsc: ifscCode,

swift: swiftCode,

};


setBankTransactions(
  updatedBanks
);

localStorage.setItem(
  "arcBanks",
  JSON.stringify(updatedBanks)
);

alert(
  "Bank Added Successfully"
);
setSelectedBank("");
setBankAccountNumber("");
setIfscCode("");
setSwiftCode("");
}}
>

Add Bank

</button>

<br />
<br />

{companyBanks.map(
(bank, index) => (

<div
key={index}
className="dashboard-card"
>

<h3>{bank.bank}</h3>

<p>
Account:
{bank.accountNumber}
</p>

<p>
IFSC:
{bank.ifsc}
</p>

<p>
SWIFT:
{bank.swift}
</p>
<button
onClick={() => {

const updatedBanks =
bankTransactions.filter(
(_, i) =>
i !== index
);

setBankTransactions(
updatedBanks
);

localStorage.setItem(
"arcBanks",
JSON.stringify(updatedBanks)
);

}}
>
Delete Bank
</button>
</div>

))
}

</>

)}

{activePage === "accounts" && (

<>

<h2>Accounting Ledger</h2>

{/* Revenue */}

<h3>Revenue Ledger</h3>

{companyInvoices
.filter(
(invoice) =>
invoice.accountType ===
"Revenue"
)
.map((invoice, index) => (

<div
key={index}
className="dashboard-card"
>

<p>
<strong>Customer:</strong>
{" "}
{invoice.customerName}
</p>

<p>
<strong>Category:</strong>
{" "}
{invoice.expenseCategory}
</p>

<p>
<strong>Amount:</strong>
{" "}
{invoice.amount || 0} USDC
</p>

</div>

))}

{/* Expenses */}

<h3>Expense Ledger</h3>

{companyInvoices
.filter(
(invoice) =>
invoice.accountType ===
"Profit & Loss"
)
.map((invoice, index) => (

<div
key={index}
className="dashboard-card"
>

<p>
<strong>Vendor:</strong>
{" "}
{invoice.vendorName}
</p>

<p>
<strong>Category:</strong>
{" "}
{invoice.expenseCategory}
</p>

<p>
<strong>Amount:</strong>
{" "}
{invoice.amount} USDC
</p>

</div>

))}

{/* Assets */}
<div className="dashboard-card">
  <p>
    <strong>ERP Wallet:</strong>
    {erpWalletBalance.toFixed(2)} USDC
  </p>
</div>

<h3>Asset Ledger</h3>

{companyInvoices
.filter(
(invoice) =>
invoice.accountType ===
"Balance Sheet Asset"
)
.map((invoice, index) => (

<div
key={index}
className="dashboard-card"
>

<p>
<strong>Asset:</strong>
{" "}
{invoice.expenseCategory}
</p>

<p>
<strong>Amount:</strong>
{" "}
{invoice.amount || 0} USDC
</p>

</div>


))}

{/* Inventory */}

<h3>Inventory Ledger</h3>

{companyInvoices
.filter(
(invoice) =>
invoice.accountType ===
"Inventory Asset"
)
.map((invoice, index) => (

<div
key={index}
className="dashboard-card"
>

<p>
<strong>Inventory:</strong>
{" "}
{invoice.expenseCategory}
</p>

<p>
<strong>Amount:</strong>
{" "}
{invoice.amount || 0} USDC
</p>

</div>

))}

{/* Liability */}

<h3>Liability Ledger</h3>

{companyInvoices
.filter(
(invoice) =>
invoice.accountType ===
"Liability"
)
.map((invoice, index) => (

<div
key={index}
className="dashboard-card"
>

<p>
<strong>Liability:</strong>
{" "}
{invoice.expenseCategory}
</p>

<p>
<strong>Amount:</strong>
{" "}
{invoice.amount || 0} USDC
</p>

</div>

))}

</>

)}
{activePage === "ledger" && (

<>

<h2>General Ledger</h2>

{companyLedger.map(
(entry,index)=>(

<div
key={index}
className="dashboard-card"
>

<p>
<strong>Type:</strong>
{" "}
{entry.type}
</p>

<p>
<strong>Account:</strong>
{" "}
{entry.account}
</p>

<p>
<strong>Amount:</strong>
{" "}
{entry.amount} USDC
</p>

</div>

))
}

</>

)}
{activePage === "balancesheet" && (

<>

<h2>Balance Sheet</h2>

{/* Fixed Assets */}

<h3>Fixed Assets</h3>

{companyInvoices
.filter(
(invoice) =>
invoice.accountType ===
"Fixed Asset"
)
.map((invoice, index) => (

<div
key={index}
className="dashboard-card"
>

<p>
<strong>
Category:
</strong>
{" "}
{invoice.expenseCategory}
</p>

<p>
<strong>
Amount:
</strong>
{" "}
{invoice.amount || 0}USDC
</p>

</div>

))}

{/* Current Assets */}

<h3>Current Assets</h3>

{companyInvoices
.filter(
(invoice) =>
invoice.accountType ===
"Balance Sheet Asset"
)
.map((invoice, index) => (

<div
key={index}
className="dashboard-card"
>

<p>
<strong>
Category:
</strong>
{" "}
{invoice.expenseCategory}
</p>

<p>
<strong>
Amount:
</strong>
{" "}
{invoice.amount || 0} USDC
</p>

</div>

))}

{/* Liabilities */}

<h3>Liabilities</h3>

{companyInvoices
.filter(
(invoice) =>
invoice.accountType ===
"Liability"
)
.map((invoice, index) => (

<div
key={index}
className="dashboard-card"
>

<p>
<strong>
Category:
</strong>
{" "}
{invoice.expenseCategory}
</p>

<p>
<strong>
Amount:
</strong>
{" "}
{invoice.amount || 0}USDC
</p>

</div>

))}

</>

)}
{activePage === "profit" && (
<>

<h2>Profit & Loss Statement</h2>

<div className="dashboard-card">

<p>
<strong>Total Revenue:</strong>
{" "}
{totalRevenue.toFixed(2)} USDC
</p>

<p>
<strong>Total Expenses:</strong>
{" "}
{totalExpenses.toFixed(2)} USDC
</p>

<div>

<strong>Net Profit:</strong>

<h1
 style={{
  color:
   netProfit >= 0
   ? "#22c55e"
   : "#ef4444"
 }}
>
 {netProfit.toFixed(2)}
</h1>

<p>USDC</p>

</div>

</div>

<h3>Revenue Transactions</h3>

{companyInvoices
.filter(
invoice =>
invoice.accountType ===
"Revenue"
)
.map((invoice,index)=>(

<div
key={index}
className="dashboard-card"
>

<p>
{invoice.expenseCategory}
</p>

<p>
{invoice.amount || 0} USDC
</p>

</div>

))}

<h3>Expense Transactions</h3>

{companyInvoices
.filter(
invoice =>
invoice.accountType ===
"Profit & Loss"
)
.map((invoice,index)=>(

<div
key={index}
className="dashboard-card"
>

<p>
{invoice.expenseCategory}
</p>

<p>
{invoice.amount || 0} USDC
</p>

</div>

))}

</>

)}
{activePage === "treasury" && (

<>

<h2>Treasury Dashboard</h2>

<div className="dashboard-card">

<h3>Treasury Overview</h3>

<p>
Wallet Balance:
{erpWalletBalance.toFixed(2)} USDC
</p>

<p>
Receivables:
{accountsReceivable.toFixed(2)} USDC
</p>

<p>
Payables:
{accountsPayable.toFixed(2)} USDC
</p>

</div>

<div className="dashboard-card">

<h3>Circle App Kit</h3>

<p>🟢 Installed</p>

<p>🟢 Viem Adapter</p>

<p>🟢 Ready For Integration</p>

</div>

<div className="dashboard-card">

<h3>Treasury Actions</h3>

<div className="treasury-actions">

<button
onClick={() =>
alert("Send Coming Soon")
}
>
Send USDC
</button>

<button
onClick={() =>
alert("Bridge Coming Soon")
}
>
Bridge USDC
</button>

<button
onClick={() =>
alert("Swap Coming Soon")
}
>
Swap Tokens
</button>

</div>

</div>

</>
)}
</div>
</div>
</div>
);


}

export default App;