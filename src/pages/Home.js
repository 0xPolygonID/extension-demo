import React, { useEffect, useState } from "react";
import { AccountInfo } from "../components/account-info";
import { CredentialsInfo } from "../components/credentials";
import DealList from "../components/DealList";
import { useNavigate } from "react-router-dom";
import { ExtensionService } from "../services/Extension.service";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
// import { Tabs, Tab } from "@mui/material";
// import { TabPanel, TabContext } from "@mui/lab";

export const Home = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [credentials, setCredentials] = useState([]);

  // Tab state
  const [tabIndex, setTabIndex] = useState("1");

  const getCredentials = async () => {
    const { credWallet } = await ExtensionService.getInstance();
    // todo find by query
    const credentials = await credWallet.list();
    setCredentials(credentials);
  };

  useEffect(() => {
    const accounts = JSON.parse(localStorage.getItem("accounts"));
    if (!accounts || accounts.length <= 0) {
      navigate("/welcome");
    } else {
      setAccounts(accounts);
    }
    window.addEventListener("storage", () => {
      console.log("Change to local storage!");
      const accounts = JSON.parse(localStorage.getItem("accounts"));
      setAccounts(accounts ? accounts : []);
      if (!accounts || accounts.length <= 0) {
        navigate("/welcome");
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
      {accounts.length <= 0 && <p>Redirecting...</p>}
      {accounts.length > 0 && (
        <div>
          <AccountInfo accounts={accounts} />
          <Tabs defaultValue="deals" className="w-[400px]">
            <TabsList className="ml-3">
              <TabsTrigger value="deals">Deals</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            <TabsContent value="deals">
              <DealList />
            </TabsContent>
            <TabsContent value="history">
              <CredentialsInfo
                credentials={credentials}
                onDeleteCredential={handleCredentialDelete}
              />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};
