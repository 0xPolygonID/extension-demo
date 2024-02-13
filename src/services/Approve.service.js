import axios from "axios";
import init, * as ecies from "ecies-wasm";
import { ExtensionService } from "./Extension.service";
import { LocalStorageServices } from './LocalStorage.services';
import { AuthHandler, FetchHandler, core, byteEncoder, byteDecoder, PROTOCOL_CONSTANTS } from '@0xpolygonid/js-sdk';
import { proving } from '@iden3/js-jwz';
const { DID } = core;

const fromHexString = (hexString) =>
  Uint8Array.from(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));

const toHexString = (bytes) =>
  bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');

export async function approveMethod(msgBytes) {
  const { packageMgr, proofService, credWallet } = ExtensionService.getExtensionServiceInstance();

  let authHandler = new AuthHandler(packageMgr, proofService, credWallet);
  let _did = DID.parse(LocalStorageServices.getActiveAccountDid());
  const authRes = await authHandler.handleAuthorizationRequest(_did, msgBytes);
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
  const { packageMgr, credWallet } = ExtensionService.getExtensionServiceInstance();
  let fetchHandler = new FetchHandler(packageMgr);
  const credentials = await fetchHandler.handleCredentialOffer(msgBytes);
  console.log(credentials);
  await credWallet.saveAll(credentials);
  return 'SAVED';
}

export async function proofMethod(msgBytes) {
  const { authHandler, packageMgr } = ExtensionService.getExtensionServiceInstance();
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
  console.log(JSON.stringify(response.token));

  const authRespBytes = byteEncoder.encode(JSON.stringify(response.authResponse));

  const packerOpts = {
          provingMethodAlg: proving.provingMethodGroth16AuthV2Instance.methodAlg
        };

  const newToken = byteDecoder.decode(
    await packageMgr.pack(PROTOCOL_CONSTANTS.MediaType.ZKPMessage, authRespBytes, {
      senderDID: did,
      ...packerOpts
    })
  );

  console.log(JSON.stringify(newToken));

  // generate token
  const pubKey = response.authRequest.body.scope[0].params?.pubKey;
  console.log('pub key ' + pubKey);
  if (pubKey) {
    const enc = await encryptMsg(pubKey, JSON.stringify(response.authResponse));
    console.log('encrypted msg' + enc);
  }
  return await axios
    .post(`${authRequest.body.callbackUrl}`, newToken, config)
    .then((response) => response)
    .catch((error) => error.toJSON());
}


async function encryptMsg(pubKey, messsage) {
  // Initialize the WASM module
  await init(); 

  //from hex to byte array(uint8array)
  const pk = fromHexString(pubKey); 

  const utf8EncodeText = new TextEncoder();

  //from string to byteArray(uint8array)
  const data = utf8EncodeText.encode(messsage); 

  const encrypted = ecies.encrypt(pk, data);

  const encryptedHex = toHexString(encrypted); //uint8array to hex conversion
  return encryptedHex;
}