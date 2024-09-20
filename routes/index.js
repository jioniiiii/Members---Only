const express = require('express');
const router = express.Router();
const boardController = require('../controllers/boardController')

//member
router.get('/msg-board', boardController.allMsgs);
router.get('/add-msg', (req, res) => {
    res.render('add-msg' , { user: req.user });
});
router.post('/add-msg/add', boardController.addMsg);

//non member
router.get('/', boardController.allMsgs);

//delete admin
router.post('/delete-msg/:id', boardController.deleteMsg);

module.exports = router;