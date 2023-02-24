import React, { useEffect, useState } from "react";
import { HeaderComponent } from "../components/app-header";
import { AccountInfo } from "../components/account-info";
import { CredentialsInfo } from "../components/credentials";
import { useNavigate } from "react-router-dom";
import { CircuitStorageInstance } from "../services";
import { ExtensionService } from "../services/Extension.service";
export const Home = (props) => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState([]);
  let _accounts = props.account.toString();

  useEffect(() => {
    if (!props.account) navigate("/welcome");
    getCredentials();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getCredentials = async () => {
    const { credWallet } = await ExtensionService.init();
	// todo find by query
    const credentials = await credWallet.list();
    setCredentials(credentials);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <HeaderComponent account={_accounts} />
      <AccountInfo account={_accounts} />
      <CredentialsInfo credentials={credentials} />
      <button
        onClick={() => {
          console.log(CircuitStorageInstance.getCircuitStorageInstance());
        }}
      >
        {" "}
        test
      </button>
    </div>
  );
};
