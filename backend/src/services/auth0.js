import axios from "axios";

export const getAccessToken = async () => {
  const options = {
    method: "POST",
    url: `${process.env.AUTH0_ISSUER_BASE_URL}/oauth/token`,
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    data: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.AUTH0_CLIENT_ID,
      client_secret: process.env.AUTH0_CLIENT_SECRET,
      audience: process.env.AUTH0_MANAGEMENT_AUDIENCE,
    }),
  };

  try {
    const res = await axios.request(options);
    return res.data.access_token;
  } catch (err) {
    throw err;
  }
};

export const assignAdminRole = async (userId, accessToken) => {
  const options = {
    method: "POST",
    url: `${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/users/${userId}/roles`,
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${accessToken}`,
      "cache-control": "no-cache",
    },
    data: { roles: [process.env.ADMIN_ROLE_ID] },
  };

  try {
    const res = await axios.request(options);
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const removeAdminRole = async (userId, accessToken) => {
  const options = {
    method: "DELETE",
    url: `${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/users/${userId}/roles`,
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${accessToken}`,
      "cache-control": "no-cache",
    },
    data: { roles: [process.env.ADMIN_ROLE_ID] },
  };

  try {
    const res = await axios.request(options);
    return res.data;
  } catch (err) {
    throw err;
  }
};
