// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// console.log(accountSid,authToken)
// const client = require("twilio")(accountSid, authToken);
const client = require("twilio")(
  "AC54575f8a129eac6918e7fbc759bc8bd3",
  // AC5a7dd6f49d2a4779c206f50168ddec90
  "d65fbf3b5d015e959daba02c66e5e724"
  //90751926d70947a21837d80d9a31f4ad
);

function message(messageBody, to) {
  console.log("in message ");
  client.messages
    .create({
      body: messageBody,
      from: "+18149925878",
      //+16505572648
      //   to: "+923056320218",
      to,
    })
    // .then((message) => console.log(message.sid))
    .then(console.log(`message sent....`))
    .catch((error) => console.log(error));
}
module.exports = { message };