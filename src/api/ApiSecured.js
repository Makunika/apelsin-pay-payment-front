import axios from "axios";
import {applyAuthTokenInterceptor, clearAuthTokens, setAuthTokens} from "axios-jwt";
import qs from "qs";

// https://www.npmjs.com/package/axios-jwt

const BASE_URL = "http://pshiblo.xyz:8080/"
const URL_AUTH = "auth-service/"
const URL_TRANSACTION = "transaction-service/"
const URL_INFO_BUSINESS = "info-business-service/"
const URL_INFO_PERSONAL = "info-personal-service/"
const URL_ACCOUNT_PERSONAL = "account-personal-service/"
const URL_ACCOUNT_BUSINESS = "account-business-service/"
const URL_PAYMENTS = "payment-service/"
const URL_USERS = "users-service/"

const API_SECURED = axios.create({
    baseURL: BASE_URL,
    responseType: "json"
})

const requestRefresh = async (refresh) => {
    const url = `${BASE_URL}${URL_AUTH}oauth/token`
    const headerAuth = `Basic ${btoa("browser_main:")}`
    console.log(refresh)
    const credentials = {
        grant_type: "refresh_token",
        refresh_token: refresh,
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
    try {
        const response = await axios(config);
        const {data} = response
        console.log(response)
        const currentUser = {
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            user: parseJwt(data.access_token)
        }
        console.log(currentUser)
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        return {
            accessToken: currentUser.accessToken,
            refreshToken: currentUser.refreshToken
        }
    } catch (e) {
        console.log(e)
        localStorage.removeItem('currentUser');
        clearAuthTokens()
    }
    return {}
}


applyAuthTokenInterceptor(API_SECURED, {
    requestRefresh,
    header: "Authorization",
    headerPrefix: "Bearer "
});

const parseJwt = (token) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
        atob(base64)
            .split('')
            .map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`)
            .join('')
    );
    return JSON.parse(jsonPayload);
};

export default API_SECURED;
export {BASE_URL, URL_PAYMENTS, URL_TRANSACTION, URL_AUTH, URL_USERS, URL_INFO_BUSINESS, URL_INFO_PERSONAL, URL_ACCOUNT_PERSONAL, URL_ACCOUNT_BUSINESS, parseJwt};

