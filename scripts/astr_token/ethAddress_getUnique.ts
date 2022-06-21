import erc72101 from "./erc721AddressList.json";
import erc72102 from "./erc721AddressList_02.json";
import erc72103 from "./erc721AddressList_03.json";
import erc72104 from "./erc721AddressList_04.json";
import ethAddressUnique from "./ethAddress_unique.json";

import erc115501 from "./erc1155AddressList.json";
import erc115502 from "./erc1155AddressList_02.json";
import erc115503 from "./erc1155AddressList_03.json";
import erc115504 from "./erc1155AddressList_04.json";
import ethAddress1155Unique from "./ethAddress_unique_1155.json";
import { writeFileNft } from "./utils";
function ethAddress_getUnique() {
  // console.log("6.15原始值：", 131);
  // console.log("6.16原始值：", 178);
  // console.log("6.17原始值：", 212);

  console.log("上一个长度：", ethAddressUnique.list.length);
  const erc721AddressList = [
    ...erc72101.list,
    ...erc72102.list,
    ...erc72103.list,
    ...erc72104.list,
    ...ethAddressUnique.list,
  ];
  writeFileNft(
    erc721AddressList,
    "ethAddress_unique",
    ethAddressUnique.list.length
  );
}

function ethAddress1155_getUnique() {
  // console.log("6.15原始值：", 131);
  // console.log("6.16原始值：", 178);
  // console.log("6.17原始值：", 212);
  // console.log("6.21原始值：", 289);
  console.log("上一个长度：", ethAddress1155Unique.list.length);
  const erc1155AddressList = [
    ...erc115501.list,
    ...erc115502.list,
    ...erc115503.list,
    ...erc115504.list,
    ...ethAddress1155Unique.list,
  ];
  writeFileNft(
    erc1155AddressList,
    "ethAddress_unique_1155",
    ethAddress1155Unique.list.length
  );
}
ethAddress_getUnique();
ethAddress1155_getUnique();
