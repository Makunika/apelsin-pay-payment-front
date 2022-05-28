import PropTypes from 'prop-types';
import React from 'react';
import {Navigate} from "react-router-dom";
import {useAuthState} from "../../context";
import {getAuthorizationUrl} from "../../api/AuthApi"
import {isAdmin} from "../userUtils";

function AdministratorGuard({ children }) {
  const account = useAuthState();
  const { isLoggedIn, user } = account;

  if (!isLoggedIn) {
    window.location = getAuthorizationUrl()
  }

  if (!isAdmin(user)) {
    return <Navigate to="/" />
  }
  
  return children;
}

AdministratorGuard.propTypes = {
  children: PropTypes.node
};

export default AdministratorGuard;
