const express = require("express");
const router = express.Router();
const excelController = require("../controllers/excelController");

const routes = (app) => {
  router.post("/upload", excelController.controller);
  router.get("/candidates", excelController.getCandidates);
  app.use("/api/excel", router);
};
module.exports = routes;
