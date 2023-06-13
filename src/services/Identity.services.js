import { RHS_URL } from "../constants";
import { ExtensionService } from "./Extension.service";
const { core, CredentialStatusType } = window.PolygonIdSdk;
export class IdentityServices {
  static instanceIS;
  static async createIdentity() {
    if (!this.instanceIS) {
      const { wallet } = ExtensionService.getExtensionServiceInstance();
    
      
      let identity = await wallet.createIdentity({
        method: core.DidMethod.PolygonId,
        blockchain: core.Blockchain.Polygon,
        networkId: core.NetworkId.Mumbai,
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
