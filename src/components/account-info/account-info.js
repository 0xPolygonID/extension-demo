import React from "react";
import LogoImage from "../../assets/logo.png";

import "./styles.css";

export const AccountInfo = (props) => {
  const currentAccount = props.accounts[0];
  return (
    <div className={"menu-bar"}>
      <div className={"account-info"}>
        <button className="connected-status-indicator" onClick={() => {}}>
          <div className={"color-indicator"}>
            <span className="color-indicator__inner-circle" />
          </div>
          <div className="connected-status-indicator__text">Connected</div>
        </button>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          style={{ height: "25px", marginRight: "5px" }}
          src={LogoImage}
          alt={"ShopConnect"}
        />
        <h3>ShopConnect</h3>
      </div>
      {/* <div className={'menu-bar__account-options'}>
				<Icon component={MoreVertIcon} color={'red'} />
			</div> */}
    </div>
  );
};
