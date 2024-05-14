import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import FullLogo from "../ui/icons/Primary_ Logo.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { ExtensionService } from "../services/Extension.service";
import { LinearProgress } from "@mui/material";
import { decodeBase64url } from "@0xpolygonid/js-sdk";


const useQuery = (key) => {
  const { search } = useLocation();
  return React.useMemo(
    () => new URLSearchParams(search).get(key),
    [search, key]
  );
};

export const OpenIdOffer = () => {
  const navigate = useNavigate();
  const dataType = useQuery("type");
  const payload = useQuery("payload");
  console.log("payload", payload);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [isReady, setIsReady] = useState(true);

  !data && setData(JSON.parse(decodeBase64url(payload)));
  console.log('data', data);

  useEffect(() => {
		const { dataStorage } = ExtensionService.getExtensionServiceInstance();
	}, [])


  async function handleClickReject() {
    navigate(`/`);
  }
  async function handleClickReceive() {
    navigate(`/openIdIssuerInfo?credential_issuer=${data.credential_issuer}`);
  }
  
  const progressHeight = 20;
  return (
    <div className={"auth-wrapper"}>
      <img src={FullLogo} alt={""} />
      <h2 >
       OpenID credential offer
      </h2>
      <div className="progress-indicator" style={{ height: progressHeight }}>
        {!isReady && <LinearProgress size={progressHeight} />}
      </div>
        {data && <div>
          <p className={"from"}>From : {data.credential_issuer}</p>
          <h3>Offer:</h3>
          {JSON.stringify(data)}
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
        </div>}
      </div>
  )
};