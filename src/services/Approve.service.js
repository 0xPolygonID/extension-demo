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
  return 'SAVED';
}

export async function proofMethod(urlParam) {
  const { packageMgr, proofService, credWallet, did } =
    ExtensionService.getExtensionServiceInstance();
  let authHandler = new AuthHandler(packageMgr, proofService, credWallet);
  let byteEncoder = new TextEncoder();
  const msgBytes = byteEncoder.encode(Base64.decode(urlParam));
  const authR = await authHandler.parseAuthorizationRequest(msgBytes);

  const { body } = authR;
  const { scope = [] } = body;

  if (scope.length > 0) {
    throw new Error("not support 2 scope");
  }
  const [zkpReq] = scope;
  const [firstCredential] = await credWallet.findByQuery(zkpReq.query);
  const response = await authHandler.generateAuthorizationResponse(
    did,
    0,
    authR,
    [
      {
        credential: firstCredential,
        req: zkpReq,
        credentialSubjectProfileNonce: 0,
      },
    ]
  );
  console.log("call proof", firstCredential, response);
}
