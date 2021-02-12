const db = require("../models/model.js");

const huntsController = {};

//create
huntsController.createHunt = (req, res, next) => {
  const params = [req.body.hunt_name, req.body.hunt_des, req.body.hunt_votes, req.body.hunt_banner, req.body.hunt_lat, req.body.hunt_long, req.body.user_id];
  const queryText =
    "INSERT INTO public.hunts (hunt_name, hunt_des, hunt_votes, hunt_banner, hunt_lat, hunt_long, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7);";

  db.query(queryText, params)
    .then((res) => next())
    .catch((err) => next(err));
};

huntsController.updateVotes = (req, res, next) => {
  const params = [req.body.hunt_id, req.body.hunt_votes];
  const queryText =
    "UPDATE public.hunts SET hunt_votes = $2 WHERE hunt_id = $1;";

  db.query(queryText, params)
    .then((res) => next())
    .catch((err) => next(err));
};

//read
// getHunt(hunt_id)z
huntsController.getHunt = (req, res, next) => {
  const params = [req.params.hunt_id];
  const queryText = "SELECT * FROM public.hunts WHERE hunt_id = $1;";

  db.query(queryText, params)
    .then((result) => {
      res.locals.hunt = result.rows;
      return next();
    })
    .catch((err) => next(err));
};

// getAllHunts()
huntsController.getAllHunts = (req, res, next) => {
  const queryText = "SELECT * FROM public.hunts LIMIT 100;";

  db.query(queryText)
    .then((result) => {
      res.locals.hunts = result.rows;
      return next();
    })
    .catch((err) => next(err));
};

module.exports = huntsController;
