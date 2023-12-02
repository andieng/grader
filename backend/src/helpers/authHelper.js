import jwksClient from "jwks-rsa";
import jwt from "jsonwebtoken";

const getPublicKey = async (token) => {
  const kid = jwt.decode(token, {
    complete: true,
  }).header.kid;
  const client = jwksClient({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
  });
  return (await client.getSigningKey(kid)).getPublicKey();
};

const getToken = (bearerToken) => {
  const parts = bearerToken.split(" ");
  if (parts.length === 2) {
    const scheme = parts[0];
    const credentials = parts[1];

    if (/^Bearer$/i.test(scheme)) {
      return credentials;
    }
  }

  return null;
};

export { getPublicKey, getToken };
