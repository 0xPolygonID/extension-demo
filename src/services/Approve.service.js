import { Base64 } from "js-base64";
import axios from "axios";
import { ExtensionService } from "./Extension.service";

const { AuthHandler, FetchHandler } = window.PolygonIdSdk;

export async function approveMethod(urlParam) {
  const { packageMgr, proofService, credWallet, did } =
    ExtensionService.getExtensionServiceInstance();
  let authHandler = new AuthHandler(packageMgr, proofService, credWallet);

  let byteEncoder = new TextEncoder();
  const msgBytes = byteEncoder.encode(Base64.decode(urlParam));
  const authRes = await authHandler.handleAuthorizationRequestForGenesisDID(
    did,
    msgBytes
  );
  console.log(authRes);

  return await axios
    .post(`${authRes.authRequest.body.callbackUrl}`, authRes.token)
    .then((response) => response)
    .catch((error) => error.toJSON());
}

export async function receiveMethod(urlParam) {
  const { packageMgr, credWallet, did } =
    ExtensionService.getExtensionServiceInstance();
  let fetchHandler = new FetchHandler(packageMgr);

  let byteEncoder = new TextEncoder();
  const msgBytes = byteEncoder.encode(Base64.decode(urlParam));
  const credentials = await fetchHandler.handleCredentialOffer(did, msgBytes);
  console.log(credentials);
  await credWallet.saveAll(credentials);
}
