import React from "react";
import Typography from "@mui/material/Typography";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DeleteIcon from "@mui/icons-material/Delete";
import { hideString } from "../../utils";
import "./styles.css";
import { IconButton } from "@mui/material";

export const CredentialsListItem = (props) => {
  const { name, issuer, credential } = props;
  const handleClick = () => props.onClick(credential);
  const handleClickDelete = (e) => {
    e.stopPropagation();
    props.onDelete(credential.id);
  };
  return (
    <div onClick={handleClick} className={"credential-list-item"}>
      <div className={"heading"}>
        <Typography
          sx={{ display: "inline" }}
          component="span"
          variant="body1"
          color="text.primary"
        >
          {name}
        </Typography>
        <Typography
          className="issuer-did"
          sx={{ display: "inline" }}
          component="span"
          variant="body2"
        >
          Issuer: {hideString(issuer)}
        </Typography>
      </div>
      <div className={"controls"}>
          <IconButton
            onClick={handleClickDelete}
            color="error"
            className="delete-button"
            aria-label="delete credential"
          >
            <DeleteIcon />
          </IconButton>
        <div className={"navigation"}>
          <ChevronRightIcon />
        </div>
      </div>
    </div>
  );
};
