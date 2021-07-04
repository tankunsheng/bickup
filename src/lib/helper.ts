import jwt_decode from "jwt-decode";

const getTokenDetails = function (idTokenString: string) {
  return jwt_decode<{ email: string; expiry: number }>(idTokenString);
};
const checkTokenExpired = function (idTokenString: string) {
  const decoded = getTokenDetails(idTokenString);
  return decoded.expiry * 1000 <= new Date().getTime();
};
export { getTokenDetails, checkTokenExpired };
