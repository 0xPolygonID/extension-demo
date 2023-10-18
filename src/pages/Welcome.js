import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "../assets/logo.png";
import { Button } from "../components/ui/button";
import { DEFAULT_ACCOUNT_NAME } from "../constants";
import { IdentityService } from "../services/Identity.service";
import { ExtensionService } from "../services/Extension.service";

export const Welcome = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [isIdentityPresent, setIdentityPresent] = useState(false);
  // const [input, setInput] = useState({
  //   password: "",
  //   confirmPassword: "",
  // });
  // const [error, setError] = useState({
  //   password: "",
  //   confirmPassword: "",
  // });

  useEffect(() => {
    (async () => {
      const { dataStorage } = await ExtensionService.getInstance();
      const identities = await dataStorage.identity.getAllIdentities();
      setIdentityPresent(identities.length > 0);
    })().catch(console.error);
  }, []);

  // const onInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setInput((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  //   validateInput(e);
  // };

  // const validateInput = (e) => {
  //   const { name, value } = e.target;
  //   setError((prev) => {
  //     const stateObj = { ...prev, [name]: "" };
  //     switch (name) {
  //       case "password":
  //         if (!value) {
  //           stateObj[name] = "Please enter Password.";
  //         } else if (input.confirmPassword && value !== input.confirmPassword) {
  //           stateObj["confirmPassword"] =
  //             "Password and Confirm Password does not match.";
  //         } else {
  //           stateObj["confirmPassword"] = input.confirmPassword
  //             ? ""
  //             : error.confirmPassword;
  //         }
  //         break;
  //       case "confirmPassword":
  //         if (!value) {
  //           stateObj[name] = "Please enter Confirm Password.";
  //         } else if (input.password && value !== input.password) {
  //           stateObj[name] = "Password and Confirm Password does not match.";
  //         }
  //         break;
  //       default:
  //         break;
  //     }
  //     return stateObj;
  //   });
  // };
  async function handleClickCreatePassword() {
    if (!isIdentityPresent) {
      const identity = await IdentityService.createIdentity();
      localStorage.setItem(
        "accounts",
        JSON.stringify([
          {
            name: DEFAULT_ACCOUNT_NAME,
            did: identity.did.string(),
            isActive: true,
          },
        ])
      );
      window.dispatchEvent(new Event("storage"));
      if (state) {
        navigate(state);
      } else {
        navigate("/");
      }
    }
  }
  return (
    <div className={"welcome-step1"}>
      <img src={Logo} alt={""} className="mb-5" />
      <h3>Welcome to</h3>
      <h1 className="text-xl font-bold">ShopConnect</h1>
      <p className="my-6">Insert product description here.</p>
      {/* <Input
        type="password"
        placeholder="Create password (min 8 characters)"
        value={input.password}
        onChange={onInputChange}
      ></Input>
      <Input
        type="password"
        placeholder="Confirm password"
        value={input.confirmPassword}
        onChange={onInputChange}
      ></Input> */}
      <Button
        onClick={handleClickCreatePassword}
        // disabled={!!error.confirmPassword || !!error.password}
      >
        Get started
      </Button>
    </div>
  );
};
