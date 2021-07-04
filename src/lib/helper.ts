import jwt_decode from "jwt-decode";

const getTokenDetails = function (idTokenString: string) {
  console.log(jwt_decode(idTokenString));
  return jwt_decode<{email: string}>(idTokenString);
};
export { getTokenDetails };
