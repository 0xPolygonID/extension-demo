import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import FullLogo from "../ui/icons/Primary_ Logo.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { ExtensionService } from "../services/Extension.service";
import { LinearProgress } from "@mui/material";
import 'react-json-view-lite/dist/index.css';
import { JsonView, allExpanded, defaultStyles } from 'react-json-view-lite';

const useQuery = (key) => {
  const { search } = useLocation();
  return React.useMemo(
    () => new URLSearchParams(search).get(key),
    [search, key]
  );
};

export const OpenIdIssuerInfo = () => {
  const navigate = useNavigate();
  const credentialIssuer = useQuery("credential_issuer");
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [isReady, setIsReady] = useState(true);
  
  !data && fetch(`${credentialIssuer}/.well-known/openid-credential-issuer`).then(response => {
    response.json().then(info => {
        console.log('in well-known', info);
        setData(info);
    });
  });

  useEffect(() => {
  }, [])

  async function handleClickReject() {
    navigate("/");
  }
  async function handleClickReceive() {
    navigate(`/openIdAuthRequest?authorization_server=${data.authorization_servers[0]}`);
  }
  
  const progressHeight = 20;
  return (
    <div className={"auth-wrapper"}>
      <img src={FullLogo} alt={""} />
      <h2>
       OpenID credential issuer info
      </h2>
      <div className="progress-indicator" style={{ height: progressHeight }}>
        {!isReady && <LinearProgress size={progressHeight} />}
      </div>
        {data && <div>
          <h3>Info:</h3>
          <React.Fragment>
            <JsonView data={data} shouldExpandNode={allExpanded} style={defaultStyles} />
          </React.Fragment>
          {/* {JSON.stringify(data)} */}
          <div className={"button-section"}>
            <Button
              className={"blue-button"}
              color="primary"
              size="medium"
              variant="outlined"
              disabled={!isReady}
              onClick={handleClickReceive}
            >
              Sent Auth Request
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
      </div>
  )
};