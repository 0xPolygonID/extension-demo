import axios from "axios";
import { ExtensionService } from "./Extension.service";
import { LocalStorageServices } from "./LocalStorage.services";
import { FetchHandler, core } from "@0xpolygonid/js-sdk";
const { DID } = core;

const config = {
  headers: {
    "Content-Type": "text/plain",
  },
  responseType: "json",
};

export async function approveMethod(msgBytes) {
  const { authHandler } = ExtensionService.getExtensionServiceInstance();

  let _did = DID.parse(LocalStorageServices.getActiveAccountDid());
  const authRes = await authHandler.handleAuthorizationRequest(_did, msgBytes);
  console.log(JSON.stringify(authRes));
  return await axios
    .post(`${authRes.authRequest.body.callbackUrl}`, authRes.token, config)
    .then((response) => response)
    .catch((error) => error.toJSON());
}

export async function receiveMethod(msgBytes) {
  const { packageMgr, credWallet } =
    ExtensionService.getExtensionServiceInstance();
  let fetchHandler = new FetchHandler(packageMgr);
  const credentials = await fetchHandler.handleCredentialOffer(msgBytes);
  console.log(credentials);
  await credWallet.saveAll(credentials);
  return "SAVED";
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
  const response = await authHandler.handleAuthorizationRequest(did, msgBytes);
  return await axios
    .post(`${authRequest.body.callbackUrl}`, response.token, config)
    .then((response) => response)
    .catch((error) => error.toJSON());
}

export async function handleMessage(msgBytes) {
  const { authHandler, proposalRequestHandler } =
    ExtensionService.getExtensionServiceInstance();

  let _did = DID.parse(LocalStorageServices.getActiveAccountDid());
  const authRequest = await authHandler.parseAuthorizationRequest(msgBytes);
  try {
    const authInfo = await authHandler.handleAuthorizationRequest(
      _did,
      msgBytes
    );
    return await axios
      .post(`${authInfo.authRequest.body.callbackUrl}`, authInfo.token, config)
      .then((response) => response)
      .catch((error) => error.toJSON());
  } catch (error) {
    console.log(error, "we in catch");
    if (!error.message.includes("no credential satisfied query")) {
      throw error;
    }
    console.log("no credential satisfied query, creating proposal request");
    // fetch issuers from registry for example
    const { token } = await proposalRequestHandler.createProposalRequestPacked({
      thid: authRequest.thid,
      sender: _did,
      receiver: core.DID.parse(
        "did:polygonid:polygon:amoy:2qXnP9aRt8FDsrCmVat5EneH4e2vDq9sgBCtj7QYhh"
      ),
      credentials: [],
    });
    console.log(token);

    const resp = await axios
      .post(`http://localhost:4202/api/protocol/handle-message`, token, config)
      .then((response) => response)
      .catch((error) => error.toJSON());

    console.log(JSON.stringify(resp, null, 2));

    console.log("proposal response received");
    if (resp?.data?.body?.proposals?.length) {
      // eslint-disable-next-line no-undef
      chrome.tabs.create({ url: `${resp.data.body.proposals[0].url}` });
    } else {
      console.error("no proposals");
    }

    return null;
  }
}
