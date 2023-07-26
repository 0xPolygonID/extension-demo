import { Base64 } from "js-base64";
import axios from "axios";
import { ExtensionService } from "./Extension.service";
import { LocalStorageServices } from './LocalStorage.services';
import { byteEncoder } from "../utils";

import { AuthHandler, FetchHandler, core } from '@0xpolygonid/js-sdk';
const { DID } = core;

export async function approveMethod(urlParam) {
  const { packageMgr, proofService, credWallet } = ExtensionService.getExtensionServiceInstance();
  
  let authHandler = new AuthHandler(packageMgr, proofService, credWallet);

  const msgBytes = byteEncoder.encode(Base64.decode(urlParam));
  let _did = DID.parse(LocalStorageServices.getActiveAccountDid());
  const authRes = await authHandler.handleAuthorizationRequest(_did, msgBytes);
  console.log(authRes);
  var config = {
    headers: {
        'Content-Type': 'text/plain'
    },
   responseType: 'json'
};
  return await axios
    .post(`${authRes.authRequest.body.callbackUrl}`, authRes.token,config)
    .then((response) => response)
    .catch((error) => error.toJSON());
}

export async function receiveMethod(urlParam) {
  const { packageMgr, credWallet } = ExtensionService.getExtensionServiceInstance();
  let fetchHandler = new FetchHandler(packageMgr);
  const msgBytes = byteEncoder.encode(Base64.decode(urlParam));
  const credentials = await fetchHandler.handleCredentialOffer(msgBytes);
  console.log(credentials);
  await credWallet.saveAll(credentials);
  return 'SAVED';
}

export async function proofMethod(urlParam) {
  const { authHandler } = ExtensionService.getExtensionServiceInstance();
  const msgBytes = byteEncoder.encode(Base64.decode(urlParam));
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
  .post(`${authRequest.body.callbackUrl}`, response.token,config)
  .then((response) => response)
  .catch((error) => error.toJSON());
}
