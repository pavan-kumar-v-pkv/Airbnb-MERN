// external modules
const express = require("express");
const hostRouter = express.Router();
// local modules
const hostController = require('../controllers/hostController');


hostRouter.get("/add-home", hostController.getAddHome);
hostRouter.post("/add-home", hostController.postAddHome);
hostRouter.get("/host-home-list", hostController.getHostHomes);

module.exports = hostRouter;