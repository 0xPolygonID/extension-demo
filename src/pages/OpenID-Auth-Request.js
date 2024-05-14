import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import FullLogo from "../ui/icons/Primary_ Logo.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { ExtensionService } from "../services/Extension.service";
import { LinearProgress } from "@mui/material";
import { Token, proving } from '@iden3/js-jwz';
import { DID } from '@iden3/js-iden3-core';
import { W3CCredential } from '@0xpolygonid/js-sdk';


const useQuery = (key) => {
  const { search } = useLocation();
  return React.useMemo(
    () => new URLSearchParams(search).get(key),
    [search, key]
  );
};

export const OpenIdAuthRequest = () => {
  const navigate = useNavigate();
  const authorizationServer = useQuery("authorization_server");
  const [error, setError] = useState(null);
  const [request, setRequest] = useState(null);
  const [response, setResponse] = useState(null);
  const [code, setCode] = useState(null);
  const [token, setToken] = useState(null);
  const [credential, setCredential] = useState(null);
  const [isReady, setIsReady] = useState(true);
  
  !request && fetch(`${authorizationServer}?response_type=code
    &scope=https://raw.githubusercontent.com/iden3/claim-schema-vocab/main/schemas/json-ld/kyc-v4.jsonld%23KYCAgeCredential
    &client_id=s6BhdRkqt3
    &code_challenge=E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM
    &code_challenge_method=S256
    &redirect_uri=https%3A%2F%2Fclient.example.org%2Fcb`).then(response => {
    response.json().then(request => {
        console.log('SIOP request', request);
        setRequest(request);
    });
  });

  const generateAuthIdTokenResponse = async (
    req,
    userDID
  ) => {
    const { proofService, authV2CircuitData } = ExtensionService.getExtensionServiceInstance();
    const user = DID.parse(userDID);
    const exp = new Date();
    exp.setDate(exp.getDate() + 1);
    const iat = new Date();
    const body = {
      "iss": userDID,
      "sub": userDID,
      "aud": "https://client.example.org/cb",
      "nonce": "n-0S6_WzA2Mj",
      "exp": exp.getTime(),
      "iat": iat.getTime()
    };
  
    const token = new Token(
      proving.provingMethodGroth16AuthV2Instance,
      JSON.stringify(body),
      (hash, circuitId) => {
        return proofService.generateAuthV2Inputs(hash, user,  circuitId)
      }
    );
    const tokenStr = await token.prove(authV2CircuitData.provingKey, authV2CircuitData.wasm);
    console.log('tokenStr', tokenStr);
    return tokenStr;
  };

  useEffect(() => {
	    const { dataStorage } = ExtensionService.getExtensionServiceInstance();
    }, [])


  async function handleClickReject() {
    navigate("/");
  }
  
  
  async function handleClickGenerate() {
    setIsReady(false);
    let accounts = JSON.parse(localStorage.getItem('accounts'));
    const tokenString = await generateAuthIdTokenResponse(request, accounts[0].did);
    setResponse(tokenString);
    setIsReady(true);
  }
  
  async function handleClickSendAuthResponse() {
    setIsReady(false);
    const codeResponse = await fetch(authorizationServer, {
      method: 'POST',
      body: JSON.stringify(response)
    });
    const codeObj = await codeResponse.json();
    setCode(codeObj.code);
    setIsReady(true);
  }

  async function handleClickReplaceCodeToToken() {
    setIsReady(false);

    const details = {
      grant_type: 'urn:ietf:params:oauth:grant-type:pre-authorized_code',
      'pre-authorized_code': code,
    };
  
    const formBody = [];
    for (const property in details) {
      const encodedKey = encodeURIComponent(property);
      const encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + '=' + encodedValue);
    }

    const tokenResp = await fetch('http://localhost:4444/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body: formBody.join('&'),
    });
    const tokenResponse = await tokenResp.json();
    console.log('access token', tokenResponse);
    setToken(tokenResponse);
    setIsReady(true);
  }

  async function handleClickFetchCredential() {
    setIsReady(false);
    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token.access_token,
    };
  
    const body = {
      format: 'ldp_vc'
    };
  
    const response = await fetch('http://localhost:4444/api/credential', {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
  
    const data = await response.json();
    const w3cCred = W3CCredential.fromJSON(data);
    setCredential(w3cCred);
    console.log('credential', w3cCred);
    setIsReady(true);
  }

  async function handleClickSaveCredential() {
    setIsReady(false);
    const { credWallet } = ExtensionService.getExtensionServiceInstance();
    await credWallet.saveAll([credential]);
    navigate('/');

  }

  const progressHeight = 20;
  return (
    <div className={"auth-wrapper"}>
      <img src={FullLogo} alt={""} />
      <h2>
       OpenID SIOP Request
      </h2>
      <div className="progress-indicator" style={{ height: progressHeight }}>
        {!isReady && <LinearProgress size={progressHeight} />}
      </div>
        {request && !response && <div>
          <h3>Request:</h3>
          {request}
          <div className={"button-section"}>
          <Button
              className={"blue-button"}
              color="primary"
              size="medium"
              variant="outlined"
              disabled={!isReady}
              onClick={handleClickGenerate}
            >
              Generate Auth Response
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
        </div>}

        {!code && response && <div>
          <h3>Response:</h3>
          {response}
          <div className={"button-section"}>
            <Button
              className={"blue-button"}
              color="primary"
              size="medium"
              variant="outlined"
              disabled={!isReady}
              onClick={handleClickSendAuthResponse}
            >
              Sent Auth Response
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
        </div>}

        {!token && code && <div>
          <h3>code:</h3>
          {code}
          <div className={"button-section"}>
            <Button
              className={"blue-button"}
              color="primary"
              size="medium"
              variant="outlined"
              disabled={!isReady}
              onClick={handleClickReplaceCodeToToken}
            >
              Replace code to token
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
        </div>}

        {!credential && token && <div>
          <h3>token:</h3>
          {JSON.stringify(token)}
          <div className={"button-section"}>
            <Button
              className={"blue-button"}
              color="primary"
              size="medium"
              variant="outlined"
              disabled={!isReady}
              onClick={handleClickFetchCredential}
            >
              Fetch credential
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
        </div>}

        {credential  && <div>
          <h3>Credential:</h3>
          {JSON.stringify(credential)}
          <div className={"button-section"}>
            <Button
              className={"blue-button"}
              color="primary"
              size="medium"
              variant="outlined"
              disabled={!isReady}
              onClick={handleClickSaveCredential}
            >
              Save
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
        </div>}
        <div className={"error"}>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      </div>
  )
};