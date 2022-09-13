window.onload = async function () {
  window.web3 = new Web3(
    new Web3.providers.HttpProvider("https://astar.api.onfinality.io/public")
  );
  window.contract = new web3.eth.Contract(ABI, AVAT_ADDRESS);
  window.BN = web3.utils.BN;
  await getETH_AccountBalance();
  const account_balance = await getAVAT_AccountBalance(fromAddress);
  console.log(`AVAT-account_balance-${fromAddress}: ` + account_balance);
  await send();
  // console.log(transfer_data.length); // 476
};
async function getETH_AccountBalance() {
  let balance = await window.web3.eth.getBalance(fromAddress);
  balance = window.web3.utils.fromWei(balance, "ether");
  console.log(`ASTR-${fromAddress}: ` + balance);
}
async function getAVAT_AccountBalance(address) {
  let balance = await window.contract.methods.balanceOf(address).call();
  balance = window.web3.utils.fromWei(balance, "ether");
  return balance;
}
const errList = [];
async function send() {
  if (!transfer_data.length) {
    return;
  }
  for await (let item of transfer_data) {
    try {
      const toAddress = item.account;
      const amount = item.value;
      const beforeBalance = await getAVAT_AccountBalance(toAddress);
      console.log(
        "Send amount of " +
          amount +
          " to " +
          toAddress +
          ", before avat balance is " +
          beforeBalance
      );

      const tokenAmount = web3.utils.toWei(amount.toString(), "ether");
      const nonce = await web3.eth.getTransactionCount(fromAddress);
      const inputData = contract.methods
        .transfer(toAddress, tokenAmount)
        .encodeABI();
      const gasPrice = await web3.eth.getGasPrice();
      const gasLimit = await web3.eth.estimateGas({
        from: fromAddress,
        nonce: web3.utils.toHex(nonce),
        gasPrice: web3.utils.toHex(gasPrice),
        to: AVAT_ADDRESS,
        data: inputData,
      });
      console.log(tokenAmount, nonce, gasLimit);

      const transaction = {
        nonce: web3.utils.toHex(nonce),
        from: fromAddress,
        gasPrice: web3.utils.toHex(gasPrice),
        gasLimit: web3.utils.toHex(gasLimit),
        to: AVAT_ADDRESS,
        data: inputData,
      };
      const senderAccount = web3.eth.accounts.privateKeyToAccount(privateKey);
      console.log("await signTransaction");
      const signedTransaction = await senderAccount.signTransaction(
        transaction
      );
      console.log("await sendSignedTransaction");
      const receipt = await web3.eth.sendSignedTransaction(
        signedTransaction.rawTransaction
      );
      console.log("await getTransaction");
      const transactionR = await web3.eth.getTransaction(
        receipt.transactionHash
      );
      console.log({
        receipt,
        transaction,
        signedTransaction,
      });
      const nowBalance = await getAVAT_AccountBalance(toAddress);
      const wantBalance = new BN(beforeBalance)
        .add(new BN(tokenAmount))
        .toString();
      if (wantBalance !== nowBalance) {
        console.log("err balance: ", { wantBalance, nowBalance, item });
        errList.push(item);
      } else {
        console.log("Success!---" + toAddress + "---" + amount);
      }
    } catch (e) {
      console.log(e);
      console.log("err:", item);
      errList.push(item);
    }
    if (errList.length) {
      console.log({ errList });
    }
  }
}
