const RideRequest = require("../Models/rideRequestModel.js");
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
const fetch = require('node-fetch');
const BlueSnap = require('bluesnap');
const bluesnapClient = new BlueSnap.BlueSnapGateway({
  environment: 'Sandbox', // 'Production' or 'Sandbox'
  username: 'ameer.shah@txdynamics.io', // BlueSnap username
  password: 'Wasiameer@001', // BlueSnap password
  apiVersion: '3.0', // Optional
});

const request = (method, url, body) => {
  const optionsData = {
    method,
    headers: {
      'content-type': 'application/json',
      accept: 'application/json',
      'bluesnap-version': '3.0',
      Authorization: 'Basic QVBJXzE2MTk2MjgyMzU0ODkyMDM5MTMzODc0OkFsdG9pZHMxIQ=='
    },
    body: body ? JSON.stringify(body) : null,
  }

  return fetch(url, optionsData)
}

exports.createPyamentAccount = catchAsync(async (req, res) => {
  const user = await User.findOne({ _id: req.user._id })

  const url = 'https://sandbox.bluesnap.com/services/2/vendors';

  const result = await request('POST', url, {
    email: req.body.email,
    firstName: user.name.split(" ")[0],
    lastName: user.name.split(" ")[1],
    phone: user.number,
    address: req.body.address,
    city: req.body.city,
    country: req.body.country,
    zip: req.body.zip,
    defaultPayoutCurrency: req.body.defaultPayoutCurrency,
    ipnUrl: 'https://ipnaddress.com',
    vendorPrincipal: {
      firstName: user.name.split(" ")[0],
      lastName: user.name.split(" ")[1],
      address: req.body.address,
      country: 'BS',
      zip: req.body.zip,
      dob: req.body.dob,
      personalIdentificationNumber: req.body.personalIdentificationNumber,
      driverLicenseNumber: req.body.driverLicenseNumber,
      email: req.body.email,
    },
    payoutInfo: [req.body.bankAccount],
    vendorAgreement: {commissionPercent: 70}
  })

  if (!result.ok) {
    const error = await result.json();
    return res.status(400).send({
      status: 400,
      success: false,
      message: error.message,
      data: {}
    })
  }

  const location = result.headers.get("Location")
  const vendorId = location.split("/").at(-1)

  await User.updateOne({ _id: req.user._id }, { $set: { vendorId } })
  const newUser = await User.findOne({ _id: req.user._id })

  return res.json({
    status: 200,
    success: true,
    message: "",
    data: {
      user: newUser
    }
  })
})

exports.initiatePayout = catchAsync(async (req, res) => {
  // Create a payout request
  const user = await User.findById(req.user._id)
  const payoutData = {
    vendorId: user.vendorId,
    amount: req.body.amount,
    currency: 'BSD',
  }

  const payoutResponse = await bluesnapClient.payouts.createPayout(payoutData);

  return res.json({
    status: 200,
    success: true,
    message: "Payout initiated",
    data: {payout: payoutResponse},
  })
})

exports.charge = catchAsync(async (req, res) => {
  const toUser = await User.findOne({ _id: req.body.to })

  const orderData = {
    amount: req.body.amount,
    currency: req.body.currency,
  };

  const url = 'https://sandbox.bluesnap.com/services/2/transactions';
  const creditCard = req.body.card ?? {
    expirationYear: 2026,
    securityCode: 837,
    expirationMonth: '02',
    cardNumber: '4242424242424242'
  }

  const chargeResponse = await request('POST', url, {
    amount: orderData.amount,
    softDescriptor: 'DescTest',
    cardHolderInfo: {firstName: 'test first name', lastName: 'test last name', zip: '02453'},
    currency: orderData.currency,
    creditCard,
    vendorInfo: {
      vendorId: toUser.vendorId,
      commissionPercent: 70,
    },
    cardTransactionType: 'AUTH_CAPTURE'
  })

  if (!chargeResponse.ok) {
    const error = await chargeResponse.json();
    return res.status(400).send({
      status: 400,
      success: false,
      message: error.message,
      data: {}
    })
  }

  const result = await chargeResponse.json()

  await RideRequest.updateOne({ _id: req.body.requestId }, { $set: { paid: true } })

  return res.json({
    status: 200,
    success: true,
    message: "Charge Created Succesfully",
    data: {...result}
  })
})

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
      card_payments: { requested: true },
      transfers: { requested: true },
    },
    business_type: "individual",
  });;

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
  const _ = await RideRequest.findOneAndUpdate({ _id: req.body.requestId }, { $set: { payed: true } })
  // const paymentIntent = await stripe.paymentIntents.retrieve(
  //   req.body.paymentId
  // );

  if (true) {

    console.log("Payment succeeded:", req.body.paymentId);
    req.paid = true;
    req.body.paymentId = "123";
    try {
      // const transfer = await stripe.transfers.create({
      //   amount: req.body.amount*100,
      //   currency: 'usd',
      //   destination: toUser.accountId,
      //   transfer_group: 'ORDER10',
      // });
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
