import axios from "axios";
import { ExtensionService } from "./Extension.service";
import { LocalStorageServices } from './LocalStorage.services';
import { AuthHandler, FetchHandler, core, PROTOCOL_CONSTANTS, KmsKeyType } from '@0xpolygonid/js-sdk';
const { DID } = core;

export async function approveMethod(msgBytes) {
  const { packageMgr, proofService, credWallet, kms } = ExtensionService.getExtensionServiceInstance();

  let authHandler = new AuthHandler(packageMgr, proofService, credWallet);
  let _did = DID.parse(LocalStorageServices.getActiveAccountDid());
  
  const keyType = KmsKeyType.Secp256k1;
  const keys = await kms.list(keyType);
  const signer = async (_, data) => {
    return kms.sign({
      type: keyType,
      id: keys[0].alias
    }, data);
  };
  const authRes = await authHandler.handleAuthorizationRequest(_did, msgBytes,
    {
      mediaType: PROTOCOL_CONSTANTS.MediaType.SignedMessage,
      packerOptions: {
        alg: 'ES256K',
        did: _did,
        issuer: _did,
        signer
      }
    }
  );
  console.log(JSON.stringify(authRes));
  const config = {
    headers: {
      'Content-Type': 'text/plain'
    },
    responseType: 'json'
  };
  return await axios
    .post(`${authRes.authRequest.body.callbackUrl}`, authRes.token, config)
    .then((response) => response)
    .catch((error) => error.toJSON());
}

export async function receiveMethod(msgBytes) {
  const { packageMgr, credWallet } = ExtensionService.getExtensionServiceInstance();
  let fetchHandler = new FetchHandler(packageMgr);
  const credentials = await fetchHandler.handleCredentialOffer(msgBytes);
  console.log(credentials);
  await credWallet.saveAll(credentials);
  return 'SAVED';
}

export async function proofMethod(msgBytes) {
  const { authHandler } = ExtensionService.getExtensionServiceInstance();
  const authRequest = await authHandler.parseAuthorizationRequest(msgBytes);
  const { body } = authRequest;
  const { scope = [] } = body;
  if (scope.length > 1) {
    throw new Error("not support 2 scope");
  }
  const did = DID.parse(LocalStorageServices.getActiveAccountDid());
  const response = await authHandler.handleAuthorizationRequest(
    did,
    msgBytes,
  );
  var config = {
    headers: {
      'Content-Type': 'text/plain'
    },
    responseType: 'json'
  };
  return await axios
    .post(`${authRequest.body.callbackUrl}`, response.token, config)
    .then((response) => response)
    .catch((error) => error.toJSON());
}
