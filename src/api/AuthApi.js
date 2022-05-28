export const BASE_AUTH_URL = "http://pshiblo.xyz:5000"
const BASE_AUTHORIZE_URL = `${BASE_AUTH_URL}/oauth/authorize`

export const getAuthorizationUrl = (state) => `${BASE_AUTHORIZE_URL}/?client_id=browser_main&redirect_uri=http://localhost:3000/login&scope=user&response_type=code&response_mode=query&state=${state}`

