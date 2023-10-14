import axios from "axios";
import { ExtensionService } from "./Extension.service";
import { LocalStorageServices } from './LocalStorage.services';
import { AuthHandler, FetchHandler, core } from '@0xpolygonid/js-sdk';
const { DID } = core;

export async function approveMethod(msgBytes) {
  const { packageMgr, proofService, credWallet } = await ExtensionService.getInstance();
  const authHandler = new AuthHandler(packageMgr, proofService, credWallet);
  const did = DID.parse(LocalStorageServices.getActiveAccountDid());
  const authRes = await authHandler.handleAuthorizationRequest(did, msgBytes);
  console.log(authRes);
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
  const { packageMgr, credWallet } = await ExtensionService.getInstance();
  const fetchHandler = new FetchHandler(packageMgr);
  const credentials = await fetchHandler.handleCredentialOffer(msgBytes);
  console.log(credentials);
  await credWallet.saveAll(credentials);
  return 'SAVED';
}

export async function proofMethod(msgBytes) {
  const { authHandler } = await ExtensionService.getInstance();
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
