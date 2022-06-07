import fetch from "node-fetch";
import { getArr, getPage, writeFile } from "./utils";

function main() {
  const row = 10;
  let contractAddress = [];
  const page = 0;

  async function inWalletHandler(row: number, page: number) {
    try {
      const r = await fetch(
        "https://astar.webapi.subscan.io/api/scan/evm/transactions",
        {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
          body: `{"row":${row},"page":${page}}`,
          method: "POST",
        }
      );
      console.log(`{"row":${row},"page":${page}}`);
      const body = await r.json();
      if (body["data"] && body["data"]["list"] && body["data"]["list"].length) {
        console.log('body["data"]["list"].length', body["data"]["list"].length);
        const arr = body["data"]["list"];
        const a = arr.map((v) => {
          return [v["from"], v["to"]];
        });
        contractAddress = getArr(contractAddress, a.flat(Infinity));
        console.log(contractAddress.length);
        writeFile(contractAddress);
        // inWalletHandler(row, getPage(page, 1));
      } else {
        writeFile(contractAddress);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async function getContract() {}
  inWalletHandler(row, getPage(page, 0));
}
main();
