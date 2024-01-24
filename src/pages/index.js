import { core } from "@0xpolygonid/js-sdk";
export * from "./Welcome";
export * from "./Home";
export * from "./Auth";
export * from "./NewAccount";
console.log("core registration");
core.registerDidMethodNetwork({
  method: core.DidMethod.Iden3,
  blockchain: "linea",
  chainId: 59140,
  network: "testnet",
  networkFlag: 0b0100_0000 | 0b0000001,
});
