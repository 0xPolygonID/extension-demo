import React from "react";
import { CredentialsListItem } from "./credentials-list-item";
import { CredentialDetails } from "./credential-details";
import "./styles.css";

export const CredentialsInfo = (props) => {
  const [selectedCredential, setSelectedCredential] = React.useState(null);

  if (selectedCredential) {
    return (
      <CredentialDetails
        credential={selectedCredential}
        onBack={() => setSelectedCredential(null)}
      />
    );
  }

  const handleCredentialClick = (credential) => {
    setSelectedCredential(credential);
  };
  const {credentials} = props;
  return (
    <div className={"credentials-info-wrapper"}>
      {credentials.map((credential, index) => {
        return (
          <CredentialsListItem
            key={index}
            name={credential.credentialSubject.type}
            issuer={credential.issuer}
            credential={credential}
            onDelete={props.onDeleteCredential}
            onClick={handleCredentialClick}
          />
        );
      })}
    </div>
  );
};
