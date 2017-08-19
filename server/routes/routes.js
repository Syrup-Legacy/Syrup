const router = require('express').Router();
const controller = require('../controller/controller');
const griffController = require('../controller/griffController');

// //Submiting a Face Photo
// router.post('/upload', controller.uploadPhoto);
//Connect with match
router.post('/match/:id/:subject_id', controller.connectMatch);
// //Getting all Matches
router.get('/matches/:userId', controller.getMatches);
// //Getting Matches by %
// router.get('/matches/percent', controller.getMatchesByPercent);
// //Getting Matches by recent
// router.get('/matches/recent', controller.getMatchesByRecent);
// //Add personal info *********CHANGEDDDD*********
router.post('/profile', controller.addProfile);
router.get('/users', griffController.getAllUsers)
router.put('/updateCoordinates', griffController.updateCoordinates)
// //Edit personali info
// router.put('/profile/:id', controller.editProfile);
// //Upload profile pic
// router.post('/profile/profilepic', controller.addProfilePic);
// //Upload photos of self
// router.post('/profile/photos', controller.addPhotos);
// //Getting individual messages
// router.get('/message/:id', controller.getMessageByUser);
// //Storing messages in DB
router.post('/message/:userId/:recipientId', controller.saveMessages);
router.get('/message/:userId/:recipientId', controller.getMessages);
// get individual profile
router.get('/profile/:id', controller.getProfile);
router.get('/profile/get/:id', controller.renderClickedProfile);

router.get('/matches/percent/:subject_id', griffController.getMatchesByPercent);

// verify match
router.get('/match/:id/:subject_id', controller.verifyMatch);

// get user id from auth0
// router.get('/user/:idToken', controller.getOneUser);

//upload photo*****CHAGNGEDD******
router.post('/photos', controller.uploadUserPhotos);

router.put('/updateProfile/:id', controller.updateProfile);

router.get('/message/:userId', controller.retrieveFirstName);


module.exports = router;
