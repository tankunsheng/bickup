const whitelist: Array<string> = [
  "http://localhost:8000",
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
      "Access-Control-Allow-Credentials": true, // Required for CORS support to work
    },
  };
};
export { handleResponse };
