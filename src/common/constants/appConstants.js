export default {
  // Endpoints
  apiBaseUrl: process.env.VUE_APP_API_URL,
  loginEndpoint: '/oauth/token',
  registerEndpoint: '/register',
  refreshEndpoint: '/oauth/token/refresh',
  logoutEndpoint: '/logout',
  getUserEndpoint: '/user',

  // This will be prefixed in authorization header with token
  // e.g. Authorization: Bearer <token>
  tokenType: 'Bearer',

  // Value of this property will be used as key to store JWT token in storage
  storageTokenKeyName: 'accessToken',
  storageRefreshTokenKeyName: 'refreshToken'
}
