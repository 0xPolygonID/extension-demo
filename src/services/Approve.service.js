import axios from "axios";
import { ExtensionService } from "./Extension.service";
import { LocalStorageServices } from "./LocalStorage.services";
import {
  PROTOCOL_CONSTANTS,
  core,
  extractDirectiveFromMessage,
} from "@0xpolygonid/js-sdk";
const { DID } = core;

const SESSION_KEY = "ACTIVE_SESSION";
const config = {
  headers: {
    "Content-Type": "text/plain",
  },
  responseType: "json",
};

async function handleProposalRequest(unpackedMessage) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(unpackedMessage));

  const { proposalRequestHandler } =
    ExtensionService.getExtensionServiceInstance();
  const userDid = DID.parse(LocalStorageServices.getActiveAccountDid());

  const directives = extractDirectiveFromMessage(unpackedMessage);
  // fetch issuers url and did from registry for example
  const { token } = await proposalRequestHandler.createProposalRequestPacked({
    thid: unpackedMessage.thid,
    sender: userDid,
    receiver: DID.parse(
      "did:polygonid:polygon:amoy:2qXnP9aRt8FDsrCmVat5EneH4e2vDq9sgBCtj7QYhh"
    ),
    credentials: [],
    directives,
  });

  const resp = await axios
    .post(`http://localhost:4202/api/protocol/handle-message`, token, config)
    .then((response) => response)
    .catch((error) => error.toJSON());

  console.log("proposal response received");
  if (!resp?.data?.body?.proposals?.length) {
    throw new Error("No proposal response received");
  }
  // eslint-disable-next-line no-undef
  chrome.tabs.create({ url: `${resp.data.body.proposals[0].url}` });

  return null;
}

export async function handleMessage(msgBytes) {
  const { authHandler, packageMgr, credWallet, fetchHandler } =
    ExtensionService.getExtensionServiceInstance();

  let _did = DID.parse(LocalStorageServices.getActiveAccountDid());
  const { unpackedMessage } = await packageMgr.unpack(msgBytes);
  switch (unpackedMessage.type) {
    case PROTOCOL_CONSTANTS.PROTOCOL_MESSAGE_TYPE
      .AUTHORIZATION_REQUEST_MESSAGE_TYPE: {
      try {
        const authInfo = await authHandler.handleAuthorizationRequest(
          _did,
          msgBytes
        );
        return await axios
          .post(
            `${authInfo.authRequest.body.callbackUrl}`,
            authInfo.token,
            config
          )
          .then((response) => response)
          .catch((error) => error.toJSON());
      } catch (error) {
        if (!error.message.includes("no credential satisfied query")) {
          throw error;
        }
        await handleProposalRequest(unpackedMessage);
      }
      break;
    }

    case PROTOCOL_CONSTANTS.PROTOCOL_MESSAGE_TYPE
      .CREDENTIAL_OFFER_MESSAGE_TYPE: {
      const credentials = await fetchHandler.handleCredentialOffer(msgBytes);
      await credWallet.saveAll(credentials);
      return "SAVED";
    }
    default:
      throw new Error("Invalid message type");
  }
}
