import {getAccessToken, getRefreshToken, isLoggedIn} from "axios-jwt";

const user = localStorage.getItem('currentUser')
    ? JSON.parse(localStorage.getItem('currentUser')).user
    : '';

const accessToken = getAccessToken();
const refreshToken = getRefreshToken();

export const initialState = {
    user: '' || user,
    accessToken: '' || accessToken,
    refreshToken: '' || refreshToken,
    isLoggedIn: isLoggedIn(),
    loading: false,
    errorMessage: null,
};

console.log(initialState);

export const AuthReducer = (initialState, action) => {
    switch (action.type) {
        case 'LOGIN_SUCCESS':
            return {
                ...initialState,
                user: action.payload.user,
                accessToken: action.payload.accessToken,
                refreshToken: action.payload.refreshToken,
                isLoggedIn: true,
                loading: false,
            };
        case 'LOGOUT':
            return {
                ...initialState,
                user: '',
                accessToken: '',
                refreshToken: '',
                isLoggedIn: false,
            };
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}