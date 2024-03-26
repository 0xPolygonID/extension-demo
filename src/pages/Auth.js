import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { approveMethod, proofMethod, receiveMethod } from "../services";
import FullLogo from "../ui/icons/Primary_ Logo.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { ExtensionService } from "../services/Extension.service";
import { CredentialRowDetail } from "../components/credentials";
import { LinearProgress } from "@mui/material";
import { base64ToBytes, PROTOCOL_CONSTANTS, byteEncoder, byteDecoder } from "@0xpolygonid/js-sdk";
import { DID } from '@iden3/js-iden3-core';
import { Base64 } from "js-base64";
import axios from "axios";
import { ProvingMethodAlg, Token } from '@iden3/js-jwz';
import { LocalStorageServices } from '../services/LocalStorage.services';

const RequestType = {
  Auth: "auth",
  CredentialOffer: "credentialOffer",
  Proof: "proof",
};
const useQuery = (key) => {
  const { search } = useLocation();
  return React.useMemo(
    () => new URLSearchParams(search).get(key),
    [search, key]
  );
};

const getTitle = (requestType) => {
  switch (requestType) {
    case RequestType.Auth:
      return "Authorization";
    case RequestType.CredentialOffer:
      return "Receive Claim";
    case RequestType.Proof:
      return "Proof request";
    default:
      return "";
  }
};

export const Auth = () => {
  const navigate = useNavigate();
  const { search, pathname } = useLocation();
  const dataType = useQuery("type");
  console.log("dataType", dataType);
  const payload = useQuery("payload");
  console.log("payload", payload);
  const [error, setError] = useState(null);
  const [requestType, setRequestType] = useState("");
  const [data, setData] = useState(null);
  const [msgBytes, setMsgBytes] = useState(null); // [msgBytes, setMsgBytes
  const [isReady, setIsReady] = useState(true);
  const [isProposalHidden, setIsProposalHidden] = useState(true);

  const detectRequest = (unpackedMessage) => {
    const { type, body } = unpackedMessage;
    const { scope = [] } = body;

    if (type.includes("request") && scope.length) {
      return RequestType.Proof;
    } else if (type.includes("offer")) {
      return RequestType.CredentialOffer;
    } else if (type.includes("request")) {
      return RequestType.Auth;
    }
  };

  useEffect(() => {
    // fix twice call
    let ignore = false;
    const { packageMgr, dataStorage } = ExtensionService.getExtensionServiceInstance();
    const fetchData = async () => {
      let msgBytes;
      if (dataType === "base64") {
        msgBytes = base64ToBytes(payload);
      } else {
        msgBytes = await fetch(decodeURIComponent(payload))
          .then(
            (res) => res.arrayBuffer()
          ).then(
            (res) => new Uint8Array(res)
          );
      }
      const { unpackedMessage } = await packageMgr.unpack(msgBytes);
      setMsgBytes(msgBytes);
      if (!ignore) {
        console.log("unpackedMessage", unpackedMessage);
        setData(unpackedMessage);
        setRequestType(detectRequest(unpackedMessage));
      }
    };
    dataStorage.identity.getAllIdentities()
      .then(_identity => {
        if (_identity.length <= 0) {
          navigate("/welcome", { state: pathname + search });
        } else fetchData().catch(console.error);
      }).catch(console.error);;

    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleClickReject() {
    navigate("/");
  }
  async function handleClickApprove() {
    setIsReady(false);
    const result = await approveMethod(msgBytes);
    if (result.data?.type && result.data.type === PROTOCOL_CONSTANTS.PROTOCOL_MESSAGE_TYPE.AUTHORIZATION_REQUEST_MESSAGE_TYPE) {
      const newPayload = Base64.encode(JSON.stringify(result.data));
      navigate("/");
      setTimeout(_ => navigate(`/auth?type=base64&payload=${newPayload}`), 2000);
      return; 
    }

    if (result.code !== "ERR_NETWORK") navigate("/");
    else {
      setError(result.message);
      setIsReady(true);
    }
  }
  async function handleClickProposalRequest() {
    setIsReady(false);
    try {
    // 1. send proposal-request to Issuer
    const issuerURL = `http://127.0.0.1:5555`;
    const verifierURL = 'http://127.0.0.1:4444';
    const config = {
      headers: {
        'Content-Type': 'text/plain'
      },
      responseType: 'json'
    };

    const proposalReq = `{
      "id": "36f9e851-d713-4b50-8f8d-8a9382f138ca",
      "thid": "36f9e851-d713-4b50-8f8d-8a9382f138ca",
      "typ": "application/iden3comm-plain-json",
      "type": "https://iden3-communication.io/credentials/0.1/proposal-request",
      "body": {
        "credentials": [
          {
            "id" : 2, 
            "type": "KYCAgeCredential",
            "context": "http://test.com"
          }
        ],
        "did_doc": {
          "@context": ["..."],
          "id": "did:polygonid:polygon:mumbai:2qEd53PwXM1rQn5851LHiCX3XRRBNf4r79Ao4uRTLx",
          "services":[
            {
               "id": "did:polygonid:polygon:mumbai:2qEd53PwXM1rQn5851LHiCX3XRRBNf4r79Ao4uRTLx/mobile",
               "type":  "Iden3Mobile"
            },
            {
               "id": "did:polygonid:polygon:mumbai:2qEd53PwXM1rQn5851LHiCX3XRRBNf4r79Ao4uRTLx/push",
               "type":  "PushNotificationService"
            }
          ]
        }
      },
      "to": "did:polygonid:polygon:mumbai:2qJUZDSCFtpR8QvHyBC4eFm6ab9sJo5rqPbcaeyGC4",
      "from": "did:polygonid:polygon:mumbai:2qEd53PwXM1rQn5851LHiCX3XRRBNf4r79Ao4uRTLx"
    }`;
    const proposalReqToken = await packMsg(proposalReq);    
    console.log('sending proposal request to Issuer');
    const response = await axios.post(issuerURL, proposalReqToken, config);
    console.log('proposal response:');
    console.log(response);
    const paymentId = response.data?.body?.proposals[0].paymentId;
    // 2. Send payment proposal to Verifier

    const paymentProposal = `{
      "id": "36f9e851-d713-4b50-8f8d-8a9382f138ca",
      "thid": "36f9e851-d713-4b50-8f8d-8a9382f138ca",
      "typ": "application/iden3comm-plain-json",
      "type": "https://iden3-communication.io/credentials/0.1/payment-proposal-request",
      "body": {
        "proposals": [
          {
            "paymentId": "${paymentId}",
            "type": "Payment"
          }
        ]
      },
      "to": "did:polygonid:polygon:mumbai:2qJUZDSCFtpR8QvHyBC4eFm6ab9sJo5rqPbcaeyGC4",
      "from": "did:polygonid:polygon:mumbai:2qEd53PwXM1rQn5851LHiCX3XRRBNf4r79Ao4uRTLx"
    }`;
    console.log(paymentProposal);
    const paymentProposalToken = await packMsg(paymentProposal);
    console.log('sending payment proposal to Verifier');
    const paymentResponse = await axios.post(`${verifierURL}/api/payment-proposal`, paymentProposalToken, config);
    console.log('payment proposal: ');
    console.log(paymentResponse);
    const signature = paymentResponse.data?.body?.sig;
    
    // 3. Proposal req with payrol to Issuer
    const proposalReqWithMeta = {
      "id": "36f9e851-d713-4b50-8f8d-8a9382f138ca",
      "thid": "36f9e851-d713-4b50-8f8d-8a9382f138ca",
      "typ": "application/iden3comm-plain-json",
      "type": "https://iden3-communication.io/credentials/0.1/proposal-request",
      "body": {
        "credentials": [
          {
            "id" : 2, 
            "type": "KYCAgeCredential",
            "context": "http://test.com"
          }
        ],
        "metadata": {
          "signature": signature
        },
        "did_doc": {
          "@context": ["..."],
          "id": "did:polygonid:polygon:mumbai:2qEd53PwXM1rQn5851LHiCX3XRRBNf4r79Ao4uRTLx",
          "services":[
            {
               "id": "did:polygonid:polygon:mumbai:2qEd53PwXM1rQn5851LHiCX3XRRBNf4r79Ao4uRTLx/mobile",
               "type":  "Iden3Mobile"
            },
            {
               "id": "did:polygonid:polygon:mumbai:2qEd53PwXM1rQn5851LHiCX3XRRBNf4r79Ao4uRTLx/push",
               "type":  "PushNotificationService"
            }
          ]
        }
      },
      "to": "did:polygonid:polygon:mumbai:2qJUZDSCFtpR8QvHyBC4eFm6ab9sJo5rqPbcaeyGC4",
      "from": "did:polygonid:polygon:mumbai:2qEd53PwXM1rQn5851LHiCX3XRRBNf4r79Ao4uRTLx"
    };

    const proposalReqWithMetaToken = await packMsg(JSON.stringify(proposalReqWithMeta));    
    console.log('sending proposal request with meta to Issuer');
    const offerResponse = await axios.post(issuerURL, proposalReqWithMetaToken, config);
    console.log('offerResponse:');
    console.log(offerResponse);
    const offetTokenBytes = byteEncoder.encode(JSON.stringify(offerResponse.data));
    await receiveMethod(offetTokenBytes);

    setError('');
    setIsProposalHidden(true);
    } catch (error) {
    console.log(error.message);
    }
    finally {
      setIsReady(true);
    }
  }

  async function packMsg(msg) {
    let _did = DID.parse(LocalStorageServices.getActiveAccountDid());
    const { packageMgr } = ExtensionService.getExtensionServiceInstance();
    const msgBytes = byteEncoder.encode(msg);
    const b = await packageMgr.pack(PROTOCOL_CONSTANTS.MediaType.ZKPMessage, msgBytes, {
      senderDID: _did,
      provingMethodAlg: new ProvingMethodAlg('groth16', 'authV2')
    });
    return byteDecoder.decode(b);
  }

  async function handleClickProof() {
    setIsReady(false);
    try {
      const result = await proofMethod(msgBytes);
      if (result.data?.type && result.data.type === PROTOCOL_CONSTANTS.PROTOCOL_MESSAGE_TYPE.AUTHORIZATION_REQUEST_MESSAGE_TYPE) {
        const newPayload = Base64.encode(JSON.stringify(result.data));
        navigate("/");
        setTimeout(_ => navigate(`/auth?type=base64&payload=${newPayload}`), 1000);
        return; 
      }
      navigate("/");
    } catch (error) {
      console.log(error.message);
      setError(error.message);
      setIsProposalHidden(false);
    } finally {
      setIsReady(true);
    }
  }

  async function handleClickReceive() {
    setIsReady(false);
    let result = await receiveMethod(msgBytes).catch((error) =>
      setError(error)
    );
    if (result === "SAVED") navigate("/");
    else {
      setError(result.message);
      setIsReady(true);
    }
  }

  const getCredentialRequestData = () => {
    const { body } = data;
    const { scope = [] } = body;
    return scope.map(({ circuitId, query }) => {
      let data = [];
      data.push({
        name: "Credential type",
        value: query.type,
      });
      query.credentialSubject &&
        data.push({
          name: "Requirements",
          value: Object.keys(query.credentialSubject).reduce((acc, field) => {
            const filter = query.credentialSubject[field];
            const filterStr = Object.keys(filter).map((operator) => {
              return `${field} - ${operator} ${filter[operator]}\n`;
            });
            return acc.concat(filterStr);
          }, ""),
        });
      data.push({
        name: "Allowed issuers",
        value: query.allowedIssuers.join(", "),
      });
      data.push({
        name: "Proof type",
        value: circuitId,
      });
      return data;
    });
  };
  const progressHeight = 20;
  return (
    <div className={"auth-wrapper"}>
      <img src={FullLogo} alt={""} />
      <h2 >
        {getTitle(requestType)}
      </h2>
      <div className="progress-indicator" style={{ height: progressHeight }}>
        {!isReady && <LinearProgress size={progressHeight} />}
      </div>
      {requestType && requestType === RequestType.Proof && (
        <div>
          <p className={"request-proof"}><b>This organization</b> requests a valid proof of next credential for <b>{data.body.reason}</b></p>
          {getCredentialRequestData().map((oneCredentialRequest) => {
            return oneCredentialRequest.map((data, index) => {
              return <CredentialRowDetail key={index} {...data} />;
            });
          })}
          <div className={"button-section"}>
            <Button
              className={"blue-button"}
              color="primary"
              size="medium"
              variant="outlined"
              disabled={!isReady}
              onClick={handleClickProof}
            >
              Continue
            </Button>
            <Button
              className={"blue-button blue-button-outlined"}
              color="primary"
              size="medium"
              variant="outlined"
              onClick={handleClickReject}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
      {requestType && requestType === RequestType.Auth && (
        <div>
          <p className={"reason"}>Reason : {data.body.reason}</p>
          <p className={"from"}>From : {data.from}</p>
          <div className={"button-section"}>
            <Button
              className={"blue-button"}
              color="primary"
              size="medium"
              variant="outlined"
              disabled={!isReady}
              onClick={handleClickApprove}
            >
              Approve
            </Button>
            <Button
              className={"blue-button blue-button-outlined"}
              color="primary"
              size="medium"
              variant="outlined"
              onClick={handleClickReject}
            >
              Reject
            </Button>
          </div>
        </div>
      )}
      {requestType && requestType === RequestType.CredentialOffer && (
        <div>
          <p className={"from"}>From : {data.from}</p>
          <h3>Credentails:</h3>
          {data.body.credentials.map((cred) => (
            <div
              style={{
                border: "1px solid black",
                borderRadius: "10px",
                padding: "5px",
              }}
            >
              <p>{cred.description}</p>
              <p>{cred.id}</p>
            </div>
          ))}
          <div className={"button-section"}>
            <Button
              className={"blue-button"}
              color="primary"
              size="medium"
              variant="outlined"
              disabled={!isReady}
              onClick={handleClickReceive}
            >
              Receive
            </Button>
            <Button
              className={"blue-button blue-button-outlined"}
              color="primary"
              size="medium"
              variant="outlined"
              onClick={handleClickReject}
            >
              Decline
            </Button>
          </div>
        </div>
      )}
      <div className={"error"}>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
      {!isProposalHidden && (
      <div className={"proposal"}>
        <Button
          className={"blue-button"}
          color="secondary"
          size="medium"
          variant="outlined"
          disabled={!isReady}
          onClick={handleClickProposalRequest}
          >
            Send Proposal Request
        </Button>
      </div>
      )}
    </div>
  );
};
