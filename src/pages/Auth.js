import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { approveMethod, proofMethod, receiveMethod } from "../services";
import FullLogo from "../ui/icons/Primary_ Logo.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { ExtensionService } from "../services/Extension.service";
import { CredentialRowDetail } from "../components/credentials";
import { LinearProgress } from "@mui/material";
import { base64ToBytes } from "@0xpolygonid/js-sdk";

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

   window.addEventListener('message', (event) => {
    console.log('back from sandbox ' + JSON.stringify(event.data.result));
    const result = event.data.result;
  });

  async function handleClickApprove() {
    setIsReady(false);
    console.log('in handleClickApprove');
    const message = {
      msgBytes,
      type: 'approveMethod',
    };
    
    document.getElementById('theFrame').contentWindow.postMessage(message, '*');
    // const now = Date.now();
    // const result = await approveMethod(msgBytes);
    // const afterAppr = Date.now();
    // console.log('approve time' + (afterAppr - now));
    // if (result.code !== "ERR_NETWORK") navigate("/");
    // else {
    //   setError(result.message);
    //   setIsReady(true);
    // }
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
