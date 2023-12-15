const express = require("express");
const feedbackController = require("../Controllers/feedbackController.js");
const transactionsController = require("../Controllers/transactionsController.js");
const ratingController = require("../Controllers/ratingController.js");
const rideRequestController = require("../Controllers/rideRequestController.js");
const termsOfUseController = require("../Controllers/termsOfUseController.js");
const privacyPolicyController = require("../Controllers/privacyPolicyController.js");
const faqsController = require("../Controllers/faqsController.js");
const aboutUsController = require("../Controllers/aboutUsController.js");


const authController = require("../Controllers/authControllers");
const { query, getQueryDoc, getPostman } = require("../txQuery");
const lambdaQuery = require("../Utils/queryLambda.js");

const _3 = require("../Utils/matchers");
const _4 = require("../Utils/postprocessors");

const router = express.Router();

router.post("/query", authController.attemptProtect, async (req, res) => {
  try {
    const data = await lambdaQuery(req.body.queries, req.user);
    // const results = []
    // for(const q of req.body.queries) results.push(await query(q, req.user._id))
    // const data = results
    return res.json({ status: 200, status: true, message: "", data });
  } catch (e) {
    console.log(e);
    return res.status(500).send({
      status: 500,
      success: false,
      message: e,
      data: {},
    });
  }
});

router.post("/localQuery", authController.attemptProtect, async (req, res) => {
  try {
    const results = [];
    for (const q of req.body.queries)
      results.push(await query(q, req.user._id));
    const data = results;
    return res.json({ status: 200, status: true, message: "", data });
  } catch (e) {
    console.log(e);
    return res.status(500).send({
      status: 500,
      success: false,
      message: e,
      data: {},
    });
  }
});

router.get("/postman/:name", async (req, res) => {
  try {
    const baseURL = req.protocol + "://" + req.get("host");
    console.log("BASE URL", baseURL);
    const fileData = await getPostman(
      baseURL,
      req.params.name,
      req.query.token
    );
    return res.send(fileData);
  } catch (e) {
    console.log(e);
    return res.status(500).send({
      status: 500,
      success: false,
      message: e,
      data: {},
    });
  }
});

router.get("/doc", async (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.send(await getQueryDoc());
});

// Protect all routes after this middleware
router.use(authController.protect);



router.get('/rideRequest', rideRequestController.index)
router.get('/rideRequest/:id', rideRequestController.find)
router.post('/rideRequest', rideRequestController.store)
router.patch('/rideRequest/:id', rideRequestController.update)
router.delete('/rideRequest/:id?', rideRequestController.delete)





router.get('/ratings', ratingController.index)
router.get('/ratings/:id', ratingController.find)
router.post('/ratings', ratingController.store)
router.patch('/ratings/:id', ratingController.update)
router.delete('/ratings/:id?', ratingController.delete)


router.post('/createPyamentAccount', transactionsController.createPyamentAccount)
router.post('/initiatePayout', transactionsController.initiatePayout)
router.post('/charge', transactionsController.charge)
router.get('/transactions/:id', transactionsController.find)
router.post('/transactions', transactionsController.store)


router.get('/transactions', transactionsController.index)
router.get('/transactions/:id', transactionsController.find)
router.post('/transactions', transactionsController.store)

router.get('/verify/:id', transactionsController.ExpressAccountVerify)
router.get('/verificationfailed/:id', transactionsController.ExpressAccountVerifyFailed)
router.get('/createStripeAccount', transactionsController.createStripeAccount)
router.post('/createIntent', transactionsController.createIntent)
router.post('/verifyIntent', transactionsController.verifyIntent)
router.get('/getLoginLink', transactionsController.getLoginLink)




router.patch('/transactions/:id', transactionsController.update)
router.delete('/transactions/:id?', transactionsController.delete)


router.get('/fAQS', faqsController.index)
router.get('/fAQS/:id', faqsController.find)
router.post('/fAQS', faqsController.store)
router.patch('/fAQS/:id', faqsController.update)
router.delete('/fAQS/:id?', faqsController.delete)


router.get('/privacyPolicy', privacyPolicyController.index)
router.get('/privacyPolicy/:id', privacyPolicyController.find)
router.post('/privacyPolicy', privacyPolicyController.store)
router.patch('/privacyPolicy/:id', privacyPolicyController.update)
router.delete('/privacyPolicy/:id?', privacyPolicyController.delete)


router.get('/termsOfUse', termsOfUseController.index)
router.get('/termsOfUse/:id', termsOfUseController.find)
router.post('/termsOfUse', termsOfUseController.store)
router.patch('/termsOfUse/:id', termsOfUseController.update)
router.delete('/termsOfUse/:id?', termsOfUseController.delete)





router.get('/aboutUs', aboutUsController.index)
router.get('/aboutUs/:id', aboutUsController.find)
router.post('/aboutUs', aboutUsController.store)
router.patch('/aboutUs/:id', aboutUsController.update)
router.delete('/aboutUs/:id?', aboutUsController.delete)





router.get('/feedback', feedbackController.index)
router.get('/feedback/:id', feedbackController.find)
router.post('/feedback', feedbackController.store)
router.patch('/feedback/:id', feedbackController.update)
router.delete('/feedback/:id?', feedbackController.delete)


module.exports = router