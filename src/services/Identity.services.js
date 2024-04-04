import { RHS_URL } from "../constants";
import { ExtensionService } from "./Extension.service";
import { CredentialStatusType } from "@0xpolygonid/js-sdk";

export class IdentityServices {
  static instanceIS;
  static async createIdentity() {
    if (!this.instanceIS) {
      const { wallet } = ExtensionService.getExtensionServiceInstance();

      let identity = await wallet.createIdentity({
        method: 'polygonid',
        blockchain: 'polygon',
        networkId: 'amoy',
        revocationOpts: {
          type: CredentialStatusType.Iden3ReverseSparseMerkleTreeProof,
          id: RHS_URL
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
