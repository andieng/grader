const auth0Config = {
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  baseURL: process.env.BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  secret: process.env.AUTH0_CLIENT_SECRET,
  idpLogout: true,
  authRequired: false,
  routes: {
    login: false,
    logout: false,
  },
};

export default auth0Config;
