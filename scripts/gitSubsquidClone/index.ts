import fetch from "node-fetch";
import { writeFile } from "./utils";
function main() {
  const arr = [
    "Orcus",
    "astar-explorer",
    "polkadot-explorer",
    "crust-v5",
    "Parity-kusama",
    "defi-tools",
    "squid-external-api",
    "squid-template",
    "deepdao-kusama",
    "deepdao-polkadot",
    "Moonriver-Transfers",
    "Astar-Degens",
    "Moonbeam-Transfers",
  ];
  async function get() {
    try {
      const data = await Promise.all(
        arr.map(async (item: string) => {
          const r = await fetch(
            `https://saas.infra.gc.subsquid.io/api/explorer/squids/${item}?withVersions=true`
          );
          const body = await r.json();
          if (body.versions[0].artifactUrl) {
            // "https://github.com/R312r0/orcus-squid-evm.git#main",
            // git@github.com:R312r0/orcus-squid-evm.git
            const artifactUrl = body.versions[0].artifactUrl.split("/");
            const git = artifactUrl[artifactUrl.length - 2];
            const gitName = artifactUrl[artifactUrl.length - 1];
            const gitPath = `git@github.com:${git}/${gitName}`
              .replace("#main", "")
              .replace("#astar", "")
              .replace("#polkadot", "")
              .replace("#kusama", "")
              .replace("#v5", "")
              .replace("#master", "")
              .replace("#db-migrations", "");
            return gitPath;
          }
        })
      );
      writeFile(data, "github_address");
    } catch (error) {
      console.log(error);
    }
  }
  get();
}

main();
