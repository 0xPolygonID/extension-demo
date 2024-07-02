import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import FullLogo from "../ui/icons/Primary_ Logo.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { ExtensionService } from "../services/Extension.service";
import { LinearProgress } from "@mui/material";
import { base64ToBytes, createProposalRequest, core, encodeBase64url, FetchHandler, PROTOCOL_CONSTANTS } from "@0xpolygonid/js-sdk";
import { LocalStorageServices } from '../services/LocalStorage.services';
import axios from "axios";
import { proving } from "@iden3/js-jwz";
import { byteDecoder } from "@0xpolygonid/js-sdk";

const { DID } = core;

const useQuery = (key) => {
  const { search } = useLocation();
  return React.useMemo(
    () => new URLSearchParams(search).get(key),
    [search, key]
  );
};

export const Offer = () => {
  const navigate = useNavigate();
  const { search, pathname } = useLocation();
  const dataType = useQuery("type");
  console.log("dataType", dataType);
  const payload = useQuery("payload");
  console.log("payload in offer", payload);
  const [error, setError] = useState(null);
  const [verificationUrl, setVerificationUrl] = useState('');
  const [data, setData] = useState(null);
  const [cred, setCred] = useState(null);
  const [isReady, setIsReady] = useState(true);


  useEffect(() => {
    let ignore = false;
    const { packageMgr } = ExtensionService.getExtensionServiceInstance();
   
    async function fetchData() {
      const msgBytes = base64ToBytes(payload);
      const { unpackedMessage } = await packageMgr.unpack(msgBytes);
      setData(unpackedMessage);
      console.log('data', unpackedMessage);
      setIsReady(true);
    }
    fetchData();
    
    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  async function handleRecieveCred(selectedCred) {
    const { packageMgr, credWallet } = ExtensionService.getExtensionServiceInstance();

    const [ context, type ] = selectedCred.id.split('#');
    setCred(selectedCred);
    const sender = DID.parse(LocalStorageServices.getActiveAccountDid());
    const proposalRequest = createProposalRequest(
      sender,
      DID.parse(data.from),
      {
        credentials: [{
          type,
          context
        }]
      }
    );


    const proposalReqPayload = encodeBase64url(JSON.stringify(proposalRequest));
    const proposalReqMsgBytes = base64ToBytes(proposalReqPayload);

    const packerOpts = {
      provingMethodAlg: proving.provingMethodGroth16AuthV2Instance.methodAlg
    };

    const token = byteDecoder.decode(
      await packageMgr.pack(PROTOCOL_CONSTANTS.MediaType.ZKPMessage, proposalReqMsgBytes, {
        senderDID: sender,
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
      .post(`${data.attachments[0].data.json.body.url}`, token, config)
      .then(async (response) => {
        console.log(response);
        if (response.data.type === PROTOCOL_CONSTANTS.PROTOCOL_MESSAGE_TYPE.CREDENTIAL_OFFER_MESSAGE_TYPE) {
          let fetchHandler = new FetchHandler(packageMgr);
          const fetchPayload = encodeBase64url(JSON.stringify(response.data));
          const msgBytes = base64ToBytes(fetchPayload);

          const credentials = await fetchHandler.handleCredentialOffer(msgBytes, {
            mediaType: PROTOCOL_CONSTANTS.MediaType.PlainMessage
          });
          console.log(credentials);
          await credWallet.saveAll(credentials);
          navigate("/")

        } else {
          setVerificationUrl(`${response.data.body.proposals[0].url}&issuerDid=${data.from}`);
        }
      })
      .catch((error) => error.toJSON());
  }

  async function handleFetchCredential() {
    await handleRecieveCred(cred);
  }
 
  const progressHeight = 20;
  return (
    <div className={"auth-wrapper"}>
      <img src={FullLogo} alt={""} />
      {!verificationUrl && (<div>
      <h2 >
        Supported credentials
      </h2>
      <div className="progress-indicator" style={{ height: progressHeight }}>
        {!isReady && <LinearProgress size={progressHeight} />}
      </div>
      {data && (
        <div>
          <p className={"from"}>From : {data.from}</p>
          <h3>Credentails:</h3>
          {data.attachments[0].data.json.body.credentials.filter(i => i.status === 'new').map((cred) => (
            <div
              style={{
                border: "1px solid black",
                borderRadius: "5px",
                padding: "5px",
                display: 'flex',
                alignItems: 'center',
                textAlign: 'center',
                flexDirection: 'column',
                marginTop: '8px'
              }}
            >
              <p style={{marginTop: '4px'}}>{cred.description}</p>
              <p style={{marginTop: '4px'}}>{cred.id}</p>
              <Button
                style={{marginTop: '4px'}}
                className={"blue-button"}
                color="primary"
                size="medium"
                variant="outlined"
                disabled={!isReady}
                onClick={() => handleRecieveCred(cred)}
              >
                Receive
            </Button>
            </div>
          ))}
        </div>
        )}

      </div>)}

      {verificationUrl && (
        <div>
        <iframe 
          title="verification"
          height="550px"
          width="100%"
          src={verificationUrl}></iframe>

        <Button
            style={{marginTop: '4px'}}
            className={"blue-button"}
            color="primary"
            size="medium"
            variant="outlined"
            disabled={!isReady}
            onClick={() => handleFetchCredential()}
          >
            Fetch credential
        </Button>
        </div>
      )}

      <div className={"error"}>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
};
