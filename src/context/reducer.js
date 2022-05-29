
const user = localStorage.getItem('currentUser')
    ? JSON.parse(localStorage.getItem('currentUser')).user
    : '';

const accessToken = localStorage.getItem('token');

export const initialState = {
    user: '' || user,
    accessToken: '' || accessToken,
    isLoggedIn: accessToken != null,
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
                isLoggedIn: true,
                loading: false,
            };
        case 'LOGOUT':
            localStorage.clear();
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