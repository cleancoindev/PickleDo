"use strict";

const Web3 = require("web3");
const HDWalletProvider = require("truffle-hdwallet-provider");
const Tx = require("ethereumjs-tx");

const testToken = require("../build/contracts/testToken");
const memonic =
  "detail august fragile luggage coyote home trap veteran witness result feed blade";
const myAddress = "0x2cA4488037250f9453032aA8dE9bE5786c5c178B";
const privateKey = Buffer.from(
  "62b8292bc6e27d594b7bf4f71bcb79c85e26cd506704c3f14d21ed1e17cfd9d3",
  "hex"
);

const provider = new HDWalletProvider(memonic, "HTTP://127.0.0.1:7545");

const contractABI = testToken.abi;
const contractAddress = "0x6f129fed5004a2a37bcb0965f2a81e2f02f20783";

const web3 = new Web3(provider);

const contract = new web3.eth.Contract(contractABI, contractAddress);

class tokenInterface {
  constructor(values) {

    this.values = values;
    this.txLog = {};
    this.txIndex = [];
  }

  async getCount() {
    const count = await web3.eth.getTransactionCount(myAddress);
    return count;
  }

  async deploy() {
    console.log("Using Module Class Version");

    const balanceOf = await contract.methods.balanceOf(myAddress).call();
    //const accounts = await web3.eth.getAccounts();
    let totalCount = await contract.methods.totalSupply.call();

    const count = await this.getCount();
    console.log("Accounts: ", this.accounts);
    console.log("Count: ", count);


    const contractMethod = contract.methods
    .mintWithTokenURI(myAddress, count, "This is token 1")
    .encodeABI();

    const rawTransaction = this._buildTransaction(myAddress, contractAddress, contractMethod, count);

    const transaction = this._signTransaction(rawTransaction, privateKey)

    this._sendTransaction(transaction);


    const isMinter = await contract.methods.isMinter(myAddress).call();

    console.log("Name: ", isMinter, " Balance: ", balanceOf);

    return balanceOf;
  }

  _buildTransaction(from, to, method, count, value = "0x0"){

    
    const gasPrice = web3.utils.toHex(20 * 1e9);
    const gasLimit =  web3.utils.toHex(210000);
    const nonce = web3.utils.toHex(count);
    

    const rawTransaction = this._rawTxbuilder(
        from,
        gasPrice,
        gasLimit,
        to,
        value,
        method,
        nonce,
      );

      return rawTransaction;
  }

  _rawTxbuilder(from, gasPrice, gasLimit, to, value, data, nonce) {
    const rawTransaction = {
      from,
      gasPrice,
      gasLimit,
      to,
      value,
      data,
      nonce
    };

    const transaction = new Tx(rawTransaction);

    return transaction;
  }

  _signTransaction(transaction, privateKey) {
    transaction.sign(privateKey);

    return transaction;
  }

  _sendTransaction(transaction) {
    web3.eth
      .sendSignedTransaction("0x" + transaction.serialize().toString("hex"))
      .once("transactionHash", hash => {
        console.log("Hash made! ", hash);
      })
      .once("receipt", receipt => {
        this.txLog[receipt.transactionHash] = receipt;
        this.txIndex.push(receipt.transactionHash);
        //console.log("Added to object", this.txLog[receipt.transactionHash]);
        console.log("txIndex: ", this.txIndex);
      });
  }

  async addMinter(address) {}

  async approve(addressTo, tokenId) {}

  async mint(addressTo, tokenId) {}

  async mintWithTokenURI(addressTo, tokenId, URIString) {
    const count = await this.getCount();


  }

  async renounceMinter() {}

  async safeTransferFrom(addressFrom, addressTo, tokenId) {}

  async setApprovalForAll(addresTo, boolApproved) {}

  async transferFrom(addressFrom, addressTo, tokenId) {}

  async balanceOf(address) {}

  async getApproved(tokenId) {}

  async isApprovedForAll(addressOwner, addressOperator) {}

  async isMinter(addressMinter) {}

  async name() {}

  async ownerOf(tokenId) {}

  async supportsInterFace(interfaceIdBytes4) {}

  async symbol() {}

  async tokenByIndex(index) {}

  async tokenOfOwnerByIndex(addressOwner, index) {}

  async tokenURI(tokenId) {}

  async totalSupply() {
    let totalCount = await contract.methods.totalSupply.call();
    return totalCount;
  }



  static connect(values) {
    return new tokenInterface(values);
  }
}

module.exports = tokenInterface;
