const User = require("../Models/userModel");

const { stripe } = require("../Utils/stripe");
exports.upgradePlan = async (req, res, next) => {
  try {
    const userId = req.user._id;
    let user = await User.findOne({ _id: userId });

    const token = await stripe.tokens.create({
      card: {
        number: req.body.number,
        exp_month: req.body.exp_month,
        exp_year: req.body.exp_year,
        cvc: req.body.cvc,
      },
    });

    const source = await stripe.customers.createSource(user.customerId, {
      source: token.id,
    });
    await stripe.customers.update(user.customerId, {
      default_source: source.id,
    });
    let price;
    if (req.body.subscriptionType == "basic") {
      price = process.env.STRIPE_BASIC;
    } else if (req.body.subscriptionType == "standard") {
      price = process.env.STRIPE_STANDARD;
    } else if (req.body.subscriptionType == "premium") {
      price = process.env.STRIPE_PREMIUM;
    }
    let subscriptionType = price; //.................set amount

    const paymentOutput = await stripe.subscriptions.create({
      customer: user.customerId,
      items: [{ price: subscriptionType }],
    });
    let subscription = paymentOutput.id;

    let updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      {
        subscriptionId: subscription,
        subscriptionType: req.body.subscriptionType,
      },
      { new: true }
    );
    return res.json({
      status: 200,
      success: true,

      message: "payment successfull",
      data: { user: updatedUser },
    });
  } catch (err) {
    return res.json({
      status: 400,
      stack: err.stack,
      success: false,
      message: err.message,
      data: {},
    });
  }
};

exports.cancelSubscription = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    await stripe.subscriptions.del(user.subscriptionId);
    let updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { subscriptionType: "not-subscribed" },
      { new: true }
    );
    return res.json({
      status: 200,
      success: true,
      message: "subscription cancelled",
      data: { user: updatedUser },
    });
  } catch (err) {
    return res.json({
      status: 400,
      success: false,
      message: err.message,
    });
  }
};
