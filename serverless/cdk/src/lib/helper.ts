import * as jwtLib from "jsonwebtoken";

const whitelist: Array<string> = [
  "http://localhost:8000",
  "http://127.0.0.1:8000",
  "http://dev-static-bickup.s3-website-ap-southeast-1.amazonaws.com",
  "http://dev-bickup-static-site.s3-website-ap-southeast-1.amazonaws.com",
];
const checkIfOriginIsCorsWhitelisted = (
  whitelist: Array<string>,
  origin: string
) => {
  return whitelist.find((whitelistOrigin) => whitelistOrigin === origin);
};
const handleResponse = (request: any, response: any) => {
  const whitelistOrigin = checkIfOriginIsCorsWhitelisted(
    whitelist,
    request.headers.origin
  );
  return {
    ...response,
    statusCode: 200,
    headers: {
      //   1. https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
      //   2. https://stackoverflow.com/questions/24687313/what-exactly-does-the-access-control-allow-credentials-header-do#:~:text=In%20order%20to%20reduce%20the,to%20include%20cookies%20on%20requests.&text=Responding%20with%20this%20header%20to,included%20on%20cross%2Dorigin%20requests.
      // https://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-cors.html
      "Access-Control-Allow-Origin": whitelistOrigin ?? "", // Required for CORS support to work
      // "Access-Control-Allow-Credentials": true, // Required for CORS support to work
      "Access-Control-Allow-Headers": "Authorizer"
    },
  };
};

//public keys of userpool of which asym key pairs are used to sign tokens
//publicly available at https://cognito-idp.{region}.amazonaws.com/{userPoolId}/.well-known/jwks.json
//for more info: https://github.com/awslabs/aws-support-tools/tree/master/Cognito/decode-verify-jwt
const userPoolJWKS = {
  keys: [
    {
      alg: "RS256",
      e: "AQAB",
      kid: "6NdObkCib/az2li329RHQ1sbTuDYxXHntAYaPoPeGwQ=",
      kty: "RSA",
      n: "1rLKJHZMAqOTquKkSrbdAsc26pK5li_NPuJM8zyKFU5eXsAnfpd3IMSmlIQBx54GKvfnLCklvd6WGViNOQoeAtYZc-O7pnhbtkotkLfqzOWy6tmPTX5w5bV7G2ra_m9xasYGr9wok3mDxNzED_h8YmOdqOSEfhk3LdQbmRVHt9X0UAp4VejlkHbcPpNSvKG12q24zMa0xeNBCGoTWuLnxFUqNzlXd5wRlo9-O9RqsBnEhE0eWib3SaMc_HzTjdVuy5i30NluMqnTUmoc9k50vevX9wg7fjkZ_IWWleB9pOTE4t9E9UpMFsCCi4i4jLccVTdsX0OhCn9XqlTA7PNnMw",
      use: "sig",
    },
    {
      alg: "RS256",
      e: "AQAB",
      kid: "7GlQ61LlTo8ZTkyM8mbpAq5Ypq8YSuxeY8AB9PmK8i0=",
      kty: "RSA",
      n: "u_jQ1snmEZLQ4MZPu_tGNNvsgIIyM2Ie_yXfw4DX9YG-jIKUzI3ReETPMQPde1TYGfuA7euPeu0EK8H7JPXL6VcRzZoCoaRijL-enSJgXH_UUHDV9OXmYyW25i8SS00EXg1boGqZUk0MiluPQ10DdklxolKjYTEOjATpjXtvkvUPUh1YuQMvRXQIlGJ1WaOSm0r4DWpChHeEN0j-DCas2MsKLMZDz68QaDetl0G48-qS4C4i7t8AMwQIcl9VREM34wHjksK0o4YYcE5ZtRrEj5ERoZRUJWRhkA7PWioP2Ors_2e75WXXLnDove9YbY26d_LSHTV8jTcRw__pNf4BZQ",
      use: "sig",
    },
  ],
};

const verifyAndDecodeJWT = function (jwtString: string, jwkToBuffer:any) {
  //1. decode jwt without verifying, we are interested in looking at the header and getting the kid
  //2. find the corresponding kid from 'userPoolJWKS' to get the right public key
  //3. convert the public key in jwks to public key pem format
  //4. verify the jwt with this public pem
  console.log(`passed in type is ${typeof jwkToBuffer}`)
  let decodedJwtUnverified = jwtLib.decode(jwtString, { complete: true });
  if (!decodedJwtUnverified) {
    throw new Error("Cannot find corresponding jwk for the jwt");
  }
  console.log(decodedJwtUnverified.header.kid);
  const jwk = userPoolJWKS.keys.find((each) => {
    return each.kid === decodedJwtUnverified!.header.kid;
  });

  console.log(jwk);
  if (!jwk) {
    throw new Error("Cannot find corresponding jwk for the jwt");
  }
  try {

    const pem = jwkToBuffer({
      e: jwk.e,
      n: jwk.n,
      kty: jwk.kty as "RSA",
    });
    const decoded = jwtLib.verify(jwtString, pem) as jwtLib.JwtPayload;
    console.log(decoded.email);
    return decoded;
  } catch (err) {
    throw err;
  }
};
// decoded example
// {
//   at_hash: 'IUIxljoG2nTwrSUo5kI-UQ',
//   sub: '5e598549-97a2-4588-b250-467c0df45a6d',
//   email_verified: false,
//   iss: 'https://cognito-idp.ap-southeast-1.amazonaws.com/ap-southeast-1_Mmej9nA9z',
//   phone_number_verified: false,
//   'cognito:username': '5e598549-97a2-4588-b250-467c0df45a6d',
//   aud: 'u0ktona8tfa865dom9oh63lfi',
//   token_use: 'id',
//   auth_time: 1625158347,
//   phone_number: '+6512345678',
//   exp: 1625161947,
//   iat: 1625158347,
//   jti: '1c175889-194d-404a-9720-5c839dd9e799',
//   email: 'tankunsheng88@gmail.com'
// }
// verifyAndDecodeJWT("eyJraWQiOiI2TmRPYmtDaWJcL2F6MmxpMzI5UkhRMXNiVHVEWXhYSG50QVlhUG9QZUd3UT0iLCJhbGciOiJSUzI1NiJ9.eyJhdF9oYXNoIjoiWUt0bU1pbXdzR0xkbXhzQXgySFprQSIsInN1YiI6IjVlNTk4NTQ5LTk3YTItNDU4OC1iMjUwLTQ2N2MwZGY0NWE2ZCIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmFwLXNvdXRoZWFzdC0xLmFtYXpvbmF3cy5jb21cL2FwLXNvdXRoZWFzdC0xX01tZWo5bkE5eiIsInBob25lX251bWJlcl92ZXJpZmllZCI6ZmFsc2UsImNvZ25pdG86dXNlcm5hbWUiOiI1ZTU5ODU0OS05N2EyLTQ1ODgtYjI1MC00NjdjMGRmNDVhNmQiLCJhdWQiOiJ1MGt0b25hOHRmYTg2NWRvbTlvaDYzbGZpIiwiZXZlbnRfaWQiOiIwOGQ4YjAxMi0yZjMxLTQ5YWEtYTZiYi1hYmFhYjlmMzZkMjgiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTYyNTE2Mjg3MiwicGhvbmVfbnVtYmVyIjoiKzY1MTIzNDU2NzgiLCJleHAiOjE2MjUxNjY0NzIsImlhdCI6MTYyNTE2Mjg3MiwianRpIjoiZDAwMjQ2Y2UtZWM1Yy00Mzg4LWJhYmUtYjVkNzdhMDU4MjhiIiwiZW1haWwiOiJ0YW5rdW5zaGVuZzg4QGdtYWlsLmNvbSJ9.sjlPe0-vc-OZ-LzPfuhkC7qpwSVv3rYGbC6pNOngUjCzsTxQsLx8B1tl6y59k-xtc_TtiqqGL-EXwn2kxiTurAm8R5bk2HCDKdZR1oACYocjtgkQymNBgW_deLcC4BqAMiQXj9pAa47bA3vzXsHFSb93OoVL9HVhlUyCFPGzRZT1ioa1zUgeDKk400szNbZNy_e81TiFJ02z1aQFD1bf9KRgnUeBIgiJANwLuMtXYagCV8_tcwzpyIJM4gQ0aITYqpzdwBkpXpz20uW9gTm3qsAWnePuFYT7ZmTwkiIKGhu8wXZn7jI6NTdBQBTlnmRCamzd0Bx_4hI5fvHTWurtbg");
export { handleResponse, verifyAndDecodeJWT };
