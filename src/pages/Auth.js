import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { approveMethod, proofMethod, receiveMethod } from "../services";
import FullLogo from "../ui/icons/Primary_ Logo.svg";
import { useNavigate } from "react-router-dom";
import { ExtensionService } from "../services/Extension.service";
import { CredentialRowDetail } from "../components/credentials";
import { LinearProgress } from "@mui/material";
import { base64ToBytes } from "@0xpolygonid/js-sdk";

const RequestType = {
  Auth: "auth",
  CredentialOffer: "credentialOffer",
  Proof: "proof",
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
  const [error, setError] = useState(null);
  const [requestType, setRequestType] = useState("");
  const [data, setData] = useState(null);
  const [msgBytes, setMsgBytes] = useState(null); // [msgBytes, setMsgBytes
  const [isReady, setIsReady] = useState(true);

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
    const { pathname, search, searchParams } = new URL(window.location);
    const dataType = searchParams.get("type");
    const payload = searchParams.get("payload");
    console.log("dataType", dataType);
    console.log("payload", payload);
    (async () => {
      const { packageMgr, dataStorage } = await ExtensionService.getInstance();
      const identity = dataStorage.identity.getAllIdentities()
      if (identity.length <= 0) {
        navigate("/welcome", { state: pathname + search });
      } else {
        let msgBytes;
        if (dataType === "base64") {
          msgBytes = base64ToBytes(payload);
        } else {
          msgBytes = await fetch(decodeURIComponent(payload))
            .then((res) => res.arrayBuffer())
            .then((res) => new Uint8Array(res));
        }
        const { unpackedMessage } = await packageMgr.unpack(msgBytes);
        setMsgBytes(msgBytes);
        console.log("unpackedMessage", unpackedMessage);
        setData(unpackedMessage);
        setRequestType(detectRequest(unpackedMessage));
      }
    })().catch(console.error);
  }, []);

  async function handleClickReject() {
    navigate("/");
  }
  async function handleClickApprove() {
    setIsReady(false);
    const result = await approveMethod(msgBytes);
    if (result.code !== "ERR_NETWORK") navigate("/");
    else {
      setError(result.message);
      setIsReady(true);
    }
  }
  async function handleClickProof() {
    setIsReady(false);
    try {
      await proofMethod(msgBytes);
      navigate("/");
    } catch (error) {
      console.log(error.message);
      setError(error.message);
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
    </div>
  );
};
