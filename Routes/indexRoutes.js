const express = require("express");
const transactionsController = require("../Controllers/transactionsController.js");
;
const ratingController = require("../Controllers/ratingController.js");
;
const rideRequestController = require("../Controllers/rideRequestController.js");



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


module.exports = router