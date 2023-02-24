import React from "react";
import Typography from "@mui/material/Typography";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { CredentialRowDetail } from "./credential-row-details";
import "./styles.css";

export const CredentialDetails = (props) => {
  const { credential } = props;
  const subjectData = Object.keys(credential.credentialSubject)
    .filter((key) => !["id", "type"].includes(key))
    .map((name) => {
      const value = credential.credentialSubject[name];
      return {
        name,
        value,
      };
    });

  const commonInfo = [
    {
      name: "Issued on",
      value: credential.issuanceDate,
    },
    {
      name: "Issuer",
      value: credential.issuer,
    },
    {
      name: "Expiration date",
      value: credential.expirationDate,
    },
    {
      name: "Proof types",
      value: credential.proof.map(({ type }) => type).join(", "),
    },
  ];
  return (
    <div className={"credentials-details-wrapper"}>
      <div className="back-arrow" onClick={props.onBack}>
        <ArrowBackIcon />
      </div>
      <div className="credential-name">
        <Typography
          sx={{ display: "inline" }}
          component="span"
          variant="subtitle1"
          color="text.primary"
        >
          {credential.credentialSubject.type}
        </Typography>
      </div>
      {[...subjectData, ...commonInfo].map((data, index) => {
        return <CredentialRowDetail key={index} {...data} />;
      })}
    </div>
  );
};

