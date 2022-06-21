import Web3 from "web3";
import Erc721 from "./abi/ERC721.json";
import Erc1155 from "./abi/ERC1155.json";
import erc721 from "./erc721AddressList_02.json";
import erc1155 from "./erc1155AddressList_02.json";
// import block from "./block.json";
import {
  getPage,
  supportsERC1155,
  supportsERC721,
  writeFileNft,
} from "./utils";
import { AbiItem } from "web3-utils";
//设置web3对象
var web3 = new Web3("https://astar.api.onfinality.io/public"); //以太坊正式网络节点地址
var erc721AddressList: any[] = erc721.list;
var erc1155AddressList: any[] = erc1155.list;

// start 1_100_000
// end  2806
// let transactionsI = 0;

const blockNumberResult = 300_000;
// doing
// 700_000-600_000

// todo

// done
// 1_100_000-1_030_000

let transactionsMaxLength = 0;
//获取当前区块高度
function getBlockNumber() {
  web3.eth.getBlockNumber().then(function (result) {
    console.log("blockNumber:" + result);
    throughBlock();
  });
}
// doing
// 400_000-300_000

// todo

// done

//从创世区块0开始遍历
function throughBlock() {
  getBlock(398362);
}

//获取当前区块的信息
async function getBlock(blockNumber) {
  try {
    console.log("getBlock blockNumber: ", blockNumber);
    const result = await web3.eth.getBlock(blockNumber);
    // console.log("getBlock result: ", JSON.stringify(result));
    if (result.transactions && result.transactions.length) {
      const transactions = result.transactions;
      transactionsMaxLength = transactions.length;
      setTimeout(async () => {
        await getTransactions(transactions, 0, blockNumber);
      }, 200);
    }
    const k = getPage(blockNumber, -1);
    if (k >= blockNumberResult) {
      setTimeout(async () => {
        process.nextTick(getBlock, k);
      }, 200);
    }
  } catch (e) {
    console.log(`error ${blockNumber}: `, e);
    if (blockNumber >= blockNumberResult) {
      setTimeout(async () => {
        process.nextTick(getBlock, blockNumber);
      }, 200);
    }
  }
}

//获取交易信息
async function getTransactions(
  transactions,
  block: number,
  blockNumber: number
) {
  try {
    const txh = transactions[block];
    const result = await web3.eth.getTransaction(txh);
    // console.log("transaction result: ", txh);
    const from = result.from;
    const to = result.to;
    await getCode(from, txh, blockNumber);
    await getCode(to, txh, blockNumber);
    const k = getPage(block, 1);
    if (k < transactionsMaxLength) {
      setTimeout(async () => {
        await getTransactions(transactions, k, blockNumber);
      }, 200);
    } else {
      transactionsMaxLength = null;
    }
  } catch (e) {
    await getTransactions(transactions, block, blockNumber);
  }
}

// 验证地址是否是合约地址
async function getCode(address, txh: string, blockNumber: number) {
  if (!address) {
    return false;
  }
  const result = await web3.eth.getCode(address);
  if (result == "0x") {
    // getBalance(address);
  } else {
    await getContract(address, blockNumber, txh);
  }
}
// 获取合约详情
async function getContract(address: string, blockNumber: number, txh: string) {
  try {
    const contract = new web3.eth.Contract(Erc721 as AbiItem[], address);
    // const name = await contract.methods.name().call();
    // const symbol = await contract.methods.symbol().call();
    const _ = await supportsERC721(contract);
    if (_) {
      // console.log("isERC721: ", address);
      erc721AddressList.push(address);
      writeFileNft(erc721AddressList, "erc721AddressList_02");
      return;
    }
    const _contract = new web3.eth.Contract(Erc1155 as AbiItem[], address);
    const __ = await supportsERC1155(_contract);
    if (__) {
      // console.log("isERC1155: ", address);
      erc1155AddressList.push(address);
      writeFileNft(erc1155AddressList, "erc1155AddressList_02");
      return;
    }
  } catch (e) {
    // console.log(e);
  }
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
