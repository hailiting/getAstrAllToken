import Web3 from "web3";
import Erc721 from "./abi/ERC721.json";
import Erc1155 from "./abi/ERC1155.json";
import { supportsERC1155, supportsERC721, writeFile } from "./utils";
//设置web3对象
// var web3 = new Web3('https://rinkeby.infura.io/'); //rinkeby测速网络节点地址，开发测试可以使用测试网络，快
var web3 = new Web3("https://astar.api.onfinality.io/public"); //以太坊正式网络节点地址

var erc721AddressList = [];
var erc1155AddressList = [];

//获取当前区块高度
function getBlockNumber() {
  web3.eth.getBlockNumber().then(function (result) {
    console.log("blockNumber:" + result);
    throughBlock(result);
  });
}

//从创世区块0开始遍历
function throughBlock(blockNumber) {
  if (!blockNumber) {
    console.log("blockNumber is 0");
    return false;
  }
  for (var i = 0; i < blockNumber; i++) {
    getBlock(i);
  }
}

//获取当前区块的信息
function getBlock(blockNumber) {
  web3.eth.getBlock(blockNumber).then(function (result) {
    const transactions = result.transactions;
    for (var i = 0; i < transactions.length; i++) {
      getTransactions(transactions[i], i);
    }
  });
}

//获取交易信息
function getTransactions(txh, block: number) {
  web3.eth.getTransaction(txh).then(function (result) {
    const from = result.from;
    const to = result.to;
    getCode(from, block);
    getCode(to, block);
  });
}

// 验证地址是否是合约地址
function getCode(address, block: number) {
  if (!address) {
    return false;
  }
  web3.eth.getCode(address).then(async function (result) {
    if (result == "0x") {
      await getContract(address, block);
      // getBalance(address);
    }
  });
}
// 获取合约详情
async function getContract(address: string, block: number) {
  try {
    const contract = new web3.eth.Contract(Erc721, address);
    const name = await contract.methods.name().call();
    const symbol = await contract.methods.symbol().call();
    const _ = await supportsERC721(contract);
    if (_) {
      erc721AddressList.push({
        name: name,
        symbol: symbol,
        block: block,
        address: address,
      });
      writeFile(erc721AddressList, "erc721AddressList");
    }
  } catch (e) {}

  try {
    const contract = new web3.eth.Contract(Erc1155, address);
    const name = await contract.methods.name().call();
    const symbol = await contract.methods.symbol().call();
    const _ = await supportsERC1155(contract);
    if (_) {
      erc1155AddressList.push({
        name: name,
        symbol: symbol,
        block: block,
        address: address,
      });
      writeFile(erc1155AddressList, "erc1155AddressList");
    }
  } catch (e) {}
}
// // 获取地址余额
// function getBalance(address) {
//   web3.eth.getBalance(address).then(function (result) {
//     if (!addressList.includes(address)) {
//       addressList.push(address);
//       console.log(address + "\t" + result); //地址 余额
//     }
//   });
// }

getBlockNumber();
