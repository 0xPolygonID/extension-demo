import React, { useEffect, useState } from "react";
import { HeaderComponent } from "../components/app-header";
import { AccountInfo } from "../components/account-info";
import { CredentialsInfo } from "../components/credentials";
import { useNavigate } from "react-router-dom";
import { ExtensionService } from "../services/Extension.service";
export const Home = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [credentials, setCredentials] = useState([]);

  const getCredentials = async () => {
    const { credWallet } = await ExtensionService.getInstance();
    // todo find by query
    const credentials = await credWallet.list();
    setCredentials(credentials);
  };

  useEffect(() => {
	  const accounts = JSON.parse(localStorage.getItem('accounts'));
	  if(!accounts || accounts.length <= 0) {
		  navigate('/welcome');
	  } else {
		  setAccounts(accounts);
	  }
    window.addEventListener("storage", () => {
      console.log("Change to local storage!");
      const accounts = JSON.parse(localStorage.getItem("accounts"));
      setAccounts(accounts ? accounts : []);
      if(!accounts || accounts.length <= 0) {
        navigate('/welcome');
      }
    });
	  getCredentials().catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCredentialDelete = async (credentialId) => {
    const { credWallet } = await ExtensionService.getInstance();
    await credWallet.remove(credentialId);
    await getCredentials().catch(console.error);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
	  { accounts.length <=0 && <p>Redirecting...</p> }
	  { accounts.length > 0 && <div>
        <HeaderComponent />
        <AccountInfo accounts={accounts} />
        <CredentialsInfo
          credentials={credentials}
          onDeleteCredential={handleCredentialDelete}
        />
	  </div>
	  }
    </div>
  );
};
