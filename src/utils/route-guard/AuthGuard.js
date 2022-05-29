import PropTypes from 'prop-types';
import React, {useEffect} from 'react';
import {useLocation} from "react-router-dom";
import {logout, useAuthDispatch, useAuthState} from "../../context";
import {getAuthorizationUrl} from "../../api/AuthApi"
import {isTokenExpired} from "../../api/ApiSecured";

function AuthGuard({ children }) {
    const account = useAuthState();
    const { isLoggedIn } = account;
    const location = useLocation();
    const dispatch = useAuthDispatch();

    useEffect(() => {
        if (localStorage.getItem("token")) {
            if (isTokenExpired(localStorage.getItem("token"))) {
                logout(dispatch)
            }
        }
    }, [location]);
    
    if (!isLoggedIn) {
        window.location = getAuthorizationUrl()
    }

    return children;
}

AuthGuard.propTypes = {
    children: PropTypes.node
};

export default AuthGuard;
