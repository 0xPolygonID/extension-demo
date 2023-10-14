import { RHS_URL } from "../constants";
import { ExtensionService } from "./Extension.service";
import { core, CredentialStatusType } from "@0xpolygonid/js-sdk";

export class IdentityService {
  static async createIdentity() {
    const { idenWallet } = await ExtensionService.getInstance();
    const identity = await idenWallet.createIdentity({
      method: core.DidMethod.PolygonId,
      blockchain: core.Blockchain.Polygon,
      networkId: core.NetworkId.Mumbai,
      revocationOpts: {
        type: CredentialStatusType.Iden3ReverseSparseMerkleTreeProof,
        id: RHS_URL
      }
    });
    console.log("Created Identity", identity);
    return identity;
  }
}
