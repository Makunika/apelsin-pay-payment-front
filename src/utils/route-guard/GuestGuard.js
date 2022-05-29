import PropTypes from 'prop-types';
import React from 'react';
import { Navigate } from 'react-router-dom';

import {useAuthState} from "../../context";


function GuestGuard({ children }) {
    const account = useAuthState();
    const { isLoggedIn } = account;

    if (isLoggedIn) {
        return <Navigate to="/apelsin" />;
    }

    return children;
}

GuestGuard.propTypes = {
    children: PropTypes.node
};

export default GuestGuard;
