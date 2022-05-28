import PropTypes from 'prop-types';
import React from 'react';
import {useAuthState} from "../../context";
import {getAuthorizationUrl} from "../../api/AuthApi"

function AuthGuard({ children }) {
    const account = useAuthState();
    const { isLoggedIn } = account;
    
    if (!isLoggedIn) {
        window.location = getAuthorizationUrl()
    }

    return children;
}

AuthGuard.propTypes = {
    children: PropTypes.node
};

export default AuthGuard;
