const express = require("express");
const usersController = require("../controllers/usersController.js");
const eventsController = require("../controllers/eventsController.js");
const huntsController = require("../controllers/huntsController.js");
const userHuntsController = require("../controllers/userHuntsController.js");
const photosController = require("../controllers/photosController.js");
const router = express.Router();

//-----------------------------------USERS-------------------------------
//-------GET-----
//get route for auth, set body.user_name and body.user_password
router.get("/users/:user_id", usersController.getUser, (req, res) => {
    return res.status(200).json(res.locals.user)
})

//------POST-----
//post route for create user, set body.username, password, 
router.post("/users", usersController.createUser, (req, res) => {
  return res.status(200).send("successfully created user");
});

//post route for auth, set body.user_name and body.user_password
router.post("/users/auth", usersController.userAuth, (req, res) => {
  return res.status(200).json(res.locals.user)
})


//-----------------------------------SUBS-------------------------------
//-------GET-----
//get route for usersSignedUpForEvent
router.get("/subs/:hunt_id", userHuntsController.getAllUsersSignedUpForHunt, (req, res) => {
    return res.status(200).json(res.locals.users)
})

//get route for usersDoingHunt
router.get("/subs/started/:hunt_id", userHuntsController.getAllUsersDoingHunt, (req, res) => {
  return res.status(200).json(res.locals.users);
});

//get route for usersCompletedHunt
router.get("/subs/completed/:hunt_id", userHuntsController.getAllUsersCompletedHunt, (req, res) => {
  return res.status(200).json(res.locals.users);
});


//------POST-----
//post route for signUpForHunt
router.post("/subs/signup", userHuntsController.signUpForHunt, (req, res) => {
  return res.status(200).send("successfully signed up for hunt");
});


//post route for startHunt
router.post("/subs/started", userHuntsController.startHunt, (req, res) => {
  return res.status(200).send("successfully started hunt");
});

//post route for completeHunt
router.post("/subs/completed", userHuntsController.completeHunt, (req, res) => {
  return res.status(200).send("successfully completed hunt");
});

//-----------------------------------HUNTS-------------------------------
//-------GET-----
//get specific hunt, set hunt_id
router.get("/hunts/:hunt_id", huntsController.getHunt, (req, res) => {
    return res.status(200).json(res.locals.hunt)
});

//get all hunts
router.get("/hunts", huntsController.getAllHunts, (req, res) => {
  return res.status(200).json(res.locals.hunts);
});

//------POST-----
router.post("/hunts/createHunt", huntsController.createHunt, (req, res) => {
  return res.status(200).json('hunt created!');
});

router.post("/hunts/updateHuntVote", huntsController.updateVotes, (req, res) => {
  return res.status(200).json('hunt votes updated!');
});

//-----------------------------------EVENTS-------------------------------
//-------GET-----
//get specific event, set event_id
router.get("/events/:event_id", eventsController.getEventByEventId, (req, res) => {
  return res.status(200).json(res.locals.event)
})

//get all events by hunt, set hunt_id
router.get("/events/getEventsByHunt/:hunt_id", eventsController.getEvents, (req, res) => {
  return res.status(200).json(res.locals.events)
})


//------POST-----
//create event, set event_name event_index event_lat event_long event_riddle hunt_id
router.post("/events/createEvent", eventsController.createEvent, (req, res) => {
  return res.status(200).send("successfully created event");
});


//-----------------------------------PHOTOS-------------------------------
//-------GET-----
//get photos by event, set event_id
router.get("/photos/getPhotos/:event_id", photosController.getPhotosByEvent, (req, res) => {
    return res.status(200).json(res.locals.photos)
})


//------POST-----
//get photos by event_id and user_id (verify they completed)
router.post("/photos/getPhotoByUserAndEvent", photosController.getPhotoByUserAndEvent, (req, res) => {
  return res.status(200).send(res.locals.photo);
});

//create photo, set user_id event_id photo_src
router.post("/photos/addPhoto", photosController.createPhoto, (req, res) => {
  return res.status(200).send("successfully created photo");
});

router.post('/photos/image-upload/:event_id/:user_id', photosController.uploadPhoto, photosController.createPhoto, photosController.getPhotosByEvent, (req, res) => {
  return res.status(200).json(res.locals.photos)
});

module.exports = router;