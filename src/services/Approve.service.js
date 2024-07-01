import axios from "axios";
import { ExtensionService } from "./Extension.service";
import { LocalStorageServices } from './LocalStorage.services';
import { AuthHandler, MessageHandler, FetchHandler, core, byteDecoder, PROTOCOL_CONSTANTS, InvitationHandler, AcceptProtocolVersion, AcceptAuthMode, AcceptJwzMode } from '@0xpolygonid/js-sdk';
import { proving } from '@iden3/js-jwz';
const { DID } = core;


export async function approveMethod(msgBytes) {
  const { packageMgr, proofService, credWallet, wallet } = ExtensionService.getExtensionServiceInstance();
  const authHandler = new AuthHandler(packageMgr, proofService, credWallet);
  const invitationHandler = new InvitationHandler(wallet, packageMgr, {
    acceptOptions: {
      protocolVersion: [AcceptProtocolVersion.iden3commV1],
      authMode: [AcceptAuthMode.jsw],
      jwzMode: [AcceptJwzMode.authV2]
    }
  });
  const messageHandler = new MessageHandler({
    messageHandlers: [invitationHandler, authHandler],
    packageManager: packageMgr
  });
  let _did = DID.parse(LocalStorageServices.getActiveAccountDid());

  const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  const authResBytes = await messageHandler.handleMessage(msgBytes, {
    senderDid: _did,
    profileNonce: getRandomInt(1000, 999999999)
  });

  const authRes = (await packageMgr.unpack(authResBytes)).unpackedMessage;
  console.log(JSON.stringify(authRes));

  const invitationReq = (await packageMgr.unpack(msgBytes)).unpackedMessage;
  console.log(JSON.stringify(invitationReq));
  const callbackUrl = invitationReq.attachments[0].data.json.body.callbackUrl;

  const packerOpts = {
    provingMethodAlg: proving.provingMethodGroth16AuthV2Instance.methodAlg
  };
  
  const authProfile = (await wallet.getProfilesByDID(_did)).find(
    (i) => i.verifier === invitationReq.from
  );

  const token = byteDecoder.decode(
    await packageMgr.pack(PROTOCOL_CONSTANTS.MediaType.ZKPMessage, authResBytes, {
      senderDID: DID.parse(authProfile.id),
      ...packerOpts
    })
  );

  const config = {
    headers: {
      'Content-Type': 'text/plain'
    },
    responseType: 'json'
  };
  return await axios
    .post(`${callbackUrl}`, token, config)
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
