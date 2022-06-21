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
export function uniqueKey(arr: string[], key: string) {
  var res = [];
  var obj = {};
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] && arr[i][key]) {
      if (!obj[arr[i][key]]) {
        obj[arr[i][key]] = 1;
        res.push(arr[i][key]);
      } else {
      }
    } else {
      if (!obj[arr[i]]) {
        obj[arr[i]] = 1;
        res.push(arr[i]);
      } else {
      }
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

export function writeFileNft(
  json: any[],
  filename: string,
  pre_length_number?: number
) {
  // const data = uniqueKey(json, "address");
  if (!json || !json.length) {
    return;
  }
  const data = unique(json);
  const jsonStr = {
    length: data.length,
    list: data,
  };
  if (pre_length_number && pre_length_number !== data.length) {
    console.log("现在的长度：", data.length);
  }
  fs.writeFile(
    path.resolve(__dirname, `./${filename}.json`),
    JSON.stringify(jsonStr),
    function (err) {
      if (err) {
        throw err;
      }
    }
  );
}
const ERC_721_IDENTIFIER = "0x80ac58cd";
const ERC_1155_IDENTIFIER = "0xd9b67a26";

export async function supportsERC721(contract: any) {
  try {
    const isNFT = await contract.methods
      .supportsInterface(ERC_721_IDENTIFIER)
      .call(); // erc721
    if (isNFT) return true;
    return false;
  } catch (e) {
    return false;
  }
}
export async function supportsERC1155(contract: any) {
  try {
    const bol2 = await contract.methods
      .supportsInterface(ERC_1155_IDENTIFIER)
      .call();
    return bol2;
  } catch (e) {
    return false;
  }
}
