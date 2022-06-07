import fs from "fs";
import path from "path";
export function unique(arr: string[]) {
  var res = [];
  var obj = {};
  for (var i = 0; i < arr.length; i++) {
    if (!obj[arr[i]]) {
      obj[arr[i]] = 1;
      res.push(arr[i]);
    } else {
    }
  }
  return res;
}
export function getPage(page: number, addPageNumber: number) {
  return Number((page + addPageNumber).toFixed(0));
}

export function getArr(preArr: string[], nextArr: string[]) {
  return unique([...preArr, ...nextArr]);
}
export function writeFile(json: any[], filename: string) {
  fs.writeFile(
    path.resolve(__dirname, `./${filename}.json`),
    JSON.stringify(json),
    function (err) {
      if (err) {
        throw err;
      }
    }
  );
}
const ERC_165_IDENTIFIER = "0x01ffc9a7";
const ERC_721_IDENTIFIER = "0x80ac58cd";
const ERC_1155_IDENTIFIER = "0xd9b67a26";

export async function supportsERC721(contract: any) {
  const bol1 = await contract.supportsInterface(ERC_165_IDENTIFIER);
  const bol2 = await contract.supportsInterface(ERC_721_IDENTIFIER);
  return bol1 && bol2;
}
export async function supportsERC1155(contract: any) {
  const bol1 = await contract.supportsInterface(ERC_165_IDENTIFIER);
  const bol2 = await contract.supportsInterface(ERC_1155_IDENTIFIER);
  return bol1 && bol2;
}
