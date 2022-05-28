import PropTypes from 'prop-types';
import React from 'react';
import {Navigate} from "react-router-dom";
import {useAuthState} from "../../context";
import {getAuthorizationUrl} from "../../api/AuthApi"
import {isModerator} from "../userUtils";

function ModeratorGuard({ children }) {
  const account = useAuthState();
  const { isLoggedIn, user } = account;

  if (!isLoggedIn) {
    window.location = getAuthorizationUrl()
  }

  if (!isModerator(user)) {
    return <Navigate to="/" />
  }
  
  return children;
}

ModeratorGuard.propTypes = {
  children: PropTypes.node
};

export default ModeratorGuard;
