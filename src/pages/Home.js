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

  useEffect(() => {
	  window.addEventListener('storage', () => {
		  console.log("Change to local storage!");
		  let accounts = JSON.parse(localStorage.getItem('accounts'));
		  setAccounts(accounts ? accounts : []);
		
	  })
	  let _accounts = JSON.parse(localStorage.getItem('accounts'));
	  if(!_accounts || _accounts.length <= 0) {
		  navigate('/welcome');
	  } else {
		  setAccounts(_accounts);
	  }
	  getCredentials();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getCredentials = async () => {
    const { credWallet } = await ExtensionService.getExtensionServiceInstance();
	// todo find by query
    const credentials = await credWallet.list();
    setCredentials(credentials);
  };

  const handleCredentialDelete = async (credentialId) => {
    const { credWallet } = ExtensionService.getExtensionServiceInstance();
    await credWallet.remove(credentialId);
    await getCredentials();
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
