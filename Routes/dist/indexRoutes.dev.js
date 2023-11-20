"use strict";

var express = require("express");

var authController = require("../Controllers/authControllers");

var submission = require("../Controllers/submissionController");

var blog = require('../Controllers/blogController');

var dietPlan = require('../Controllers/dietPlanController');

var ad = require('../Controllers/adController');

var quiz = require('../Controllers/quizController');

var workout = require('../Controllers/workoutController');

var completedExercise = require('../Controllers/completedExerciseController');

var tracker = require('../Controllers/trackerController');

var video = require('../Controllers/videoController');

var subscription = require('../Controllers/subscriptionController');

var faq = require('../Controllers/faqController');

var rating = require('../Controllers/ratingController');

var help = require("../Controllers/helpCenterController");

var router = express.Router();
router.get('/quiz', quiz.index); // Protect all routes after this middleware

router.use(authController.protect);
router.post('/quiz', quiz.store);
router.patch('/quiz/:id', quiz.update);
router["delete"]('/quiz/:id', quiz["delete"]);
router.get('/submission', submission.index);
router.post('/submission', submission.store);
router.get('/blog', blog.index);
router.post('/blog', blog.store);
router.patch('/blog/:id', blog.update);
router["delete"]('/blog/:id', blog["delete"]);
router.get('/video', video.index);
router.post('/video', video.store);
router.patch('/video/:id', video.update);
router["delete"]('/video/:id', video["delete"]);
router.get('/dietPlan', dietPlan.index);
router.post('/dietPlan', dietPlan.store);
router.patch('/dietPlan/:id', dietPlan.update);
router["delete"]('/dietPlan/:id', dietPlan["delete"]);
router.get('/ad', ad.index);
router.post('/ad', ad.store);
router.patch('/ad/:id', ad.update);
router["delete"]('/ad/:id', ad["delete"]);
router.get('/diet-plans', tracker.diets);
router.get('/tracker', tracker.index);
router.get('/tracker/all', tracker.all);
router.post('/tracker', tracker.store);
router.get('/workout', workout.index);
router.post('/workout', workout.store);
router.patch('/workout/:id', workout.update);
router["delete"]('/workout/:id', workout["delete"]);
router.get('/is_locked', subscription.isLocked);
router.post('/unlock', subscription.unlock);
router["delete"]('/cancel_subscription', subscription.cancel);
router.get('/current_subscription', subscription.current);
router.get('/subscription_types', subscription.types);
router.post('/resubscribe', subscription.resubscribe);
router.post('/complete-exercise/:id', completedExercise.store);
router.get('/faq', faq.index);
router.post('/faq', faq.store);
router.patch('/faq/:id', faq.update);
router["delete"]('/faq/:id', faq["delete"]);
router.get('/rating', rating.index);
router.post('/rating', rating.store);
router.patch('/rating/:id', rating.update);
router["delete"]('/rating/:id', rating["delete"]);
router.get('/helpCenter', help.index);
router.post('/helpCenter', help.store);
router.patch('/helpCenter/:id', help.update);
router["delete"]('/helpCenter/:id', help["delete"]);
router.get('/notification', completedExercise.index);
module.exports = router;