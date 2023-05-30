import { RHS_URL } from "../constants";
import { ExtensionService } from "./Extension.service";
import { core, CredentialStatusType } from '@0xpolygonid/js-sdk';
export class IdentityServices {
  static instanceIS;
  static async createIdentity() {
    if (!this.instanceIS) {
      const { wallet } = ExtensionService.getExtensionServiceInstance();

      let identity = await wallet.createIdentity({
        method: core.DidMethod.Iden3,
        blockchain: core.Blockchain.Polygon,
        networkId: core.NetworkId.Mumbai,
        revocationOpts: {
          type: CredentialStatusType.Iden3ReverseSparseMerkleTreeProof,
          baseUrl: RHS_URL
        }
      });
      console.log("!!!!!!!!!!!!!!!!", identity);
      this.instanceIS = identity;
      return this.instanceIS;
    } else return this.instanceIS;
  }

  static getIdentityInstance() {
    return this.instanceIS;
  }
}
