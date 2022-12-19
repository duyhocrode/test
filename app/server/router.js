module.exports = app => {
    const round = require("../controllers/round.controller.js");
    var router = require("express").Router();

    // Retrieve all Tutorials
    router.get("/", round.findAll);
    router.get("/paginate", rounds.paginate);

    app.use('/api/round', router);
};