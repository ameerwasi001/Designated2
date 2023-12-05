// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// console.log(accountSid,authToken)
// const client = require("twilio")(accountSid, authToken);
const client = require("twilio")(
  "AC5a7dd6f49d2a4779c206f50168ddec90",
  "90751926d70947a21837d80d9a31f4ad"
);

function message(messageBody, to) {
  console.log("in message ");
  client.messages
    .create({
      body: messageBody,
      from: "+1 650 557 2648",
      //+16505572648
      //   to: "+923056320218",
      to,
    })
    // .then((message) => console.log(message.sid))
    .then(console.log(`message sent....`))
    .catch((error) => console.log(error));
}
module.exports = { message };
