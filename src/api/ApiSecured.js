import axios from "axios";

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


export const parseJwt = (token) => {
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

export const isTokenExpired = token => {
    const { exp } = parseJwt(token);
    return Date.now() >= exp * 1000
};

const API_SECURED = axios.create({
    baseURL: BASE_URL,
    responseType: "json"
})

API_SECURED.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';

    if(isTokenExpired(token)) {
        localStorage.clear();
    }

    config.headers.Authorization = token !== '' ? `Bearer ${token}` : '';
    return config;
});

export default API_SECURED;
export {BASE_URL, URL_PAYMENTS, URL_TRANSACTION, URL_AUTH, URL_USERS, URL_INFO_BUSINESS, URL_INFO_PERSONAL, URL_ACCOUNT_PERSONAL, URL_ACCOUNT_BUSINESS};

