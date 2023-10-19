import React from "react";
import LogoImage from "../../assets/logo.png";
import { Badge } from "../ui/badge";

import "./styles.css";

export const AccountInfo = (props) => {
  const connectedSite = "nike.com"

  return (
    <div className={"menu-bar"}>
      <div className={"account-info"}>
        <Badge variant="secondary" className="flex">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2"/>
          {connectedSite}
        </Badge>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <img className="h-6 mr-2" src={LogoImage} alt={"ShopConnect"} />
        <h3 className="text-lg font-bold">ShopConnect</h3>
      </div>
    </div>
  );
};
