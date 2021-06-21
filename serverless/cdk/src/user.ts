import * as CognitoIdentityServiceProvider from "aws-sdk/clients/cognitoidentityserviceprovider";
import { resolve } from "dns";
//https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#adminAddUserToGroup-property
const register = async function (event: any, context: any) {
  const method = event.httpMethod;
  console.log("add registration to cognito userpool");
  console.log(process.env);
  console.log(process.env.USER_POOL_ARN);
  console.log(process.env.USER_POOL_CLIENT_ID);
  if (!process.env.USER_POOL_CLIENT_ID) {
    console.log("return");
    return;
  }
  console.log(method);
  if (method === "POST") {
    console.log("doing post");
    const cognitoidentityserviceprovider = new CognitoIdentityServiceProvider();
    var params = {
      ClientId: process.env.USER_POOL_CLIENT_ID || "" /* required */,
      Password: "1234qwer" /* required */,
      Username: "tankunsheng88@gmail.com" /* required */,
      UserAttributes: [
        {
          Name: "phone_number" /* required */,
          Value: "+6512345678",
        },
      ],
    };
    try {
      let result = await new Promise((resolve, reject) => {
        cognitoidentityserviceprovider.signUp(params, function (err, data) {
          if (err) {
            console.log(err, err.stack);
            reject(err);
          }
          // an error occurred
          else {
            console.log(data);
            resolve(data);
          } // successful response
        });
      });

      console.log("================REGISTERED===============");
      console.log(result);
      return {
        body: JSON.stringify({
          statusCode: 200,
          message: `REGISTERED`,
        }),
      };
    } catch (err) {
      console.log("================ERROR===============");
      console.log(err);
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: `Already Registered`,
        }),
      };
    }
  } else {
    console.log("not post method");
    return "Method Not Supported";
  }
};
export { register };
