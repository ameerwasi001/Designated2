const Transactions = require("../Models/transactionsModel.js");
const User = require("../Models/userModel.js");
const stripe = require("stripe")(`${process.env.STRIPE_SECRET_KEY}`);
const TxDeleter = require("../txDeleter");
const {
  Query,
  QueryModel,
  QueryBuilder,

  Matcher,
  Eq,

  PostProcessor
} = require("../Utils/query");
const catchAsync = require("../Utils/catchAsync");

exports.find = catchAsync(async (req, res, next) => {
  const transactions = await Transactions.find({})

  res.status(200).json({
    status: 200,
    success: true,
    message: '',
    data: {transactions},
  });
});

exports.index = catchAsync(async (req, res, next) => {
  const transactions = await Transactions.find( {$or:[{receiver:req.user._id},{sender:req.user._id}]}).populate("sender").populate("receiver")
  const user=await User.findById(req.user._id).select("+balance")
  res.status(200).json({
    status: 200,
    success: true,
    message: '',
    data: {transactions,balance:user.balance},
  });
});

exports.store = catchAsync(async (req, res, next) => {
  console.log(req.user._id);
  console.log("body",req.body);
  const transactions = await Transactions.create(req.body);
  const user=await User.findById(req.user._id).select("+balance")
  console.log("user",user);
  const newBalance=req.body.type=="incoming"? user.balance+req.body.amount:user.balance-req.body.amount
  console.log("new balance",newBalance);
await User.findByIdAndUpdate(req.user._id,{balance:newBalance})
  res.status(200).json({
    status: 200,
    success: true,
    message: 'Transactions Created Successfully',
    data: {transactions},
  });
});

exports.update = catchAsync(async (req, res, next) => {
    const transactions = await Transactions.findByIdAndUpdate(req.params.id, {$set: JSON.parse(JSON.stringify(req.body))}, { new: true });
  
    res.status(200).json({
      status: 200,
      success: true,
      message: 'Transactions Edited',
      data: {transactions},
    });
});

exports.delete = catchAsync(async (req, res, next) => {
  let transactions =  await Transactions.findOne(req.params.id ? { _id: req.params.id } : JSON.parse(decodeURIComponent(req.query)))
  transactions = await TxDeleter.deleteOne("Transactions", req.params.id)

  res.status(200).json({
      status: 200,
      success: true,
      message: 'Transactions Deleted',
      data: {transactions},
    });
});

exports.createStripeAccount = catchAsync(async (req, res, next) => {
  // let ogAccount = req.user;
  let account = { id: null };

  const countryCode = {
    austria: "AT",
    argentina: "AR",
    sweden: "SE",
    usa: "US",
    "U.K": "GB",
    germany: "GR",
    europe: "ES",
    france: "FR",
    spain: "ES",
  };

  account = await stripe.accounts.create({
    country: countryCode["usa"],
    type: "express",
    capabilities: {
      // card_payments: { requested: true },
      transfers: { requested: true },
    },
    tos_acceptance: {
      service_agreement: "recipient",
    },
    business_type: "individual",
  });

  const user = await User.findOneAndUpdate(
    // { _id: ogAccount.organizerId },
    { _id: req.user.id },
    { $set: { accountId: account.id } },
    { new: true }
  );

  accountLink = await stripe.accountLinks.create({
    account: `${account.id}`,
    refresh_url: `http://ec2-43-204-108-65.ap-south-1.compute.amazonaws.com/verificationfailed/${user._id}`,
    return_url: `http://ec2-43-204-108-65.ap-south-1.compute.amazonaws.com/verify/${user._id}`,
    type: "account_onboarding",
  });
  // await User.updateOne({ _id: user._id }, { $set: { isStripeAccSet: true } });
  console.log("Acc Creation", account, "Account Link", accountLink);
  return res.json({
    status: 200,
    success: true,
    message: "",
    data: { user, accountLink },
  });
});

exports.ExpressAccountVerify = catchAsync(async (req, res, next) => {
  let act;
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      $set: { isStripeAccSet: true },
    },
    { new: true }
  );
  let link = await stripe.accounts.createLoginLink(user.accountId);

  // ////////////////////////////////
  // // sending notiffication alert
  // const user1 = await User.findOne({ _id: user._id });
  // await Notification.create({
  //   sender: user.organizerProfile._id,
  //   receiver: user.organizerProfile._id,
  //   sender_model_type: "Organizer",
  //   receiver_model_type: "Organizer",
  //   notifyType: "payment-account-confirmed",
  //   title: `Payment Account Confirmed`,
  //   text: `Successfully setup payment account`,
  //   data: { user: user1._id },
  // });
  // const tokens = JSON.parse(
  //   JSON.stringify(await RefreshToken.find({ user: user1.id }))
  // ).map(({ deviceToken }) => deviceToken);
  // if (user1.isNotification) {
  //   for (const deviceToken of tokens) {
  //     await SendNotification({
  //       token: deviceToken,
  //       title: `Payment Account Confirmed`,
  //       body: `Successfully setup payment account`,
  //       data: {
  //         value: JSON.stringify({ user: user1._id }),
  //       },
  //     });
  //   }
  // }
  // ////////////////////

  // if (user.role === "individual_rider") {
  //   act = loginChecksIndividualRider(user);
  // }

  // if (user.role === "company") {
  //   act = loginChecksCompany(user);
  // }

  return res.json({
    status: 200,
    success: true,
    act: act,
    message: "Express Account Verified",
    data: { link },
  });
});

exports.ExpressAccountVerifyFailed = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, {
    $set: { isStripeAccSet: false },
  });
  // const organizer = await Organizer.findById(user.organizerProfile._id);
  let link = await stripe.accountLinks.create({
    account: `${user.accountId}`,
    refresh_url: `http://ec2-43-204-108-65.ap-south-1.compute.amazonaws.com/verificationfailed/${user._id}`,
    return_url: `http://ec2-43-204-108-65.ap-south-1.compute.amazonaws.com/verify/${user._id}`,
    type: "account_onboarding",
  });
  return res.json({
    status: 400,
    success: false,
    message: "Express Account Verification Failed",
    data: { link },
  });
});

exports.createIntent = async (req, res) => {
  let customer;
  // Use an existing Customer ID if this is a returning customer.
  const { amount } = req.body;
  const user = await User.findById(req.user._id);
  if (user.customerId) {
    customer = {
      id: user.customerId,
    };
  } else {
    customer = await stripe.customers.create();
    user.customerId = customer.id;
    await user.save({ validateBeforeSave: false });
  }
  const ephemeralKey = await stripe.ephemeralKeys.create(
    { customer: customer.id },
    { apiVersion: "2022-08-01" }
  );
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100,
    currency: "usd",
    customer: customer.id,
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
  });

  return res.status(200).json({
    status: 200,
    success: true,
    paymentIntentId: paymentIntent.id,
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id,
    publishableKey:
      "",
  });
};

exports.verifyIntent = catchAsync(async (req, res, next) => {
 
  const toUser=await User.findById(req.body.to)
  console.log("reqqqqqq>>>><<<<",toUser)
  const paymentIntent = await stripe.paymentIntents.retrieve(
    req.body.paymentId
  );

  if (paymentIntent && paymentIntent.status === "succeeded") {

    console.log("Payment succeeded:", req.body.paymentId);
    req.paid = true;
    req.body.paymentId = req.body.paymentId;
    try {
      const transfer = await stripe.transfers.create({
        amount: req.body.amount*100,
        currency: 'usd',
        destination: toUser.accountId,
        transfer_group: 'ORDER10',
      });
    } catch (e) {}

  //   const transactions = await Transactions.create(req.body);
  //   const user=await User.findById(req.user._id).select("+balance")
  //   console.log("user",user);
  //   const newBalance=req.body.type=="incoming"? user.balance+req.body.amount:user.balance-req.body.amount
  //   console.log("new balance",newBalance);
  // await User.findByIdAndUpdate(req.user._id,{balance:newBalance})

    return res.status(200).json({
      status: 200,
      success: true,
     message:"hogya waaaa"
    });
  
    // next();
  } else {
    //  Payment failed
    // console.log("Payment failed", req.body.paymentId);
    return res.status(500).send({ error: "Payment failed" });
  }
});

exports.getLoginLink = catchAsync(async (req, res) => {
  const user = await User.findOne({ _id: req.user.id });
  let link = null;
  try {
    console.log("accccccccccc iddddddd",user.accountId)
    link = await stripe.accounts.createLoginLink(user.accountId);
  } catch (e) {
    console.log("innnnnnnnnnn",e)
    link = await stripe.accountLinks.create({
      account: `${user.accountId}`,
      refresh_url: `http://ec2-43-204-108-65.ap-south-1.compute.amazonaws.com/verificationfailed/${user._id}`,
      return_url: `http://ec2-43-204-108-65.ap-south-1.compute.amazonaws.com/stripe/verify/${user._id}`,
      type: "account_onboarding",
    });
  }
  return res.json({
    status: 200,
    success: true,
    message: "",
    data: { link },
  });
});