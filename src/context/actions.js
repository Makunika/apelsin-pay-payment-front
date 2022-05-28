import axios from "axios";
import {clearAuthTokens, isLoggedIn, setAuthTokens} from "axios-jwt";
import qs from "qs";
import {BASE_URL, parseJwt, URL_AUTH} from "../api/ApiSecured";

export async function loginUser(dispatch, loginPayload) {
    console.log(loginPayload);

    const url = `${BASE_URL}${URL_AUTH}oauth/token`
    const headerAuth = `Basic ${btoa("browser_main:")}`

    const credentials = {
        grant_type: "authorization_code",
        code: loginPayload.code,
        redirect_uri: "http://localhost:3000/login",
        client_id: "browser_main",
    }

    const config = {
        url,
        headers: {
            "Authorization": headerAuth
        },
        method: 'post',
        data: qs.stringify(credentials)
    };

    return axios(config)
        .then(res => {
            console.log(res)
            return res.data
        })
        .then(data => {
            const currentUser = {
                accessToken: data.access_token,
                refreshToken: data.refresh_token,
                user: parseJwt(data.access_token)
            }
            console.log(currentUser)
            dispatch({ type: 'LOGIN_SUCCESS', payload: currentUser });
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            setAuthTokens({
                accessToken: currentUser.accessToken,
                refreshToken: currentUser.refreshToken
            })
            return currentUser.user
        })
}

export async function logout(dispatch) {
    dispatch({ type: 'LOGOUT' });
    localStorage.removeItem('currentUser');
    clearAuthTokens()
}

export function checkAuth() {
    console.log(`auth - ${isLoggedIn()}`)
}