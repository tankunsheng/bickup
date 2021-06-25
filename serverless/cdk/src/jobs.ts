import axios from "axios";

const createJob = async function (event: any, context: any) {
  console.log("create job");
};

// telegram restapis reference: https://core.telegram.org/bots/api#making-requests
// simple messages can be sent in the format of POST https://api.telegram.org/bot1891683701:AAFRELCirvrwZldZ0E-NaWo-4hHx-IS9OJ4/sendMessage
//   {
//     "chat_id": "-334215881",
//     "text": "test"
//   }
const handleJobStream = async function (event: any, context: any) {
  console.log(event);
  console.log(event.dynamodb);
  console.log(context);
  console.log("db stream job");
 
  const testToken = "1891683701:AAFRELCirvrwZldZ0E-NaWo-4hHx-IS9OJ4";
  const testChat = "-334215881";
  let test = await axios.post(
    `https://api.telegram.org/bot${testToken}/sendMessage`,
    {
      chat_id: testChat+"",
      text: "dynamodb stream event",
    }
  );
  console.log("after axios")
  console.log(axios)
  console.log(test)
};
export { createJob, handleJobStream };

