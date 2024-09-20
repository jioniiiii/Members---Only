const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

//sing-up
router.get("/sign-up", authController.signUpGet);
router.post("/sign-up", authController.signUpPost);

//log-in
router.get("/log-in", (req, res) => {
    res.render('log-in' , { user: req.user });
});
router.post("/log-in", authController.logInPost);

//log-out
router.get("/log-out", authController.logOutGet);

module.exports = router;