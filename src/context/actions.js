import {parseJwt} from "../api/ApiSecured";

export async function loginUser(dispatch, token) {
    const currentUser = {
        accessToken: token,
        user: parseJwt(token)
    }
    console.log(currentUser)
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    localStorage.setItem('token', token);
    dispatch({ type: 'LOGIN_SUCCESS', payload: currentUser });
}

export function logout(dispatch) {
    dispatch({ type: 'LOGOUT' });
    localStorage.clear();
}