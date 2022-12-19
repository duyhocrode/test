module.exports = app => {
    const round = require("../controller/round-controller");
    var router = require("express").Router();

    // Retrieve all Tutorials
    router.get("/", round.findAll);
    router.get("/paginate", round.paginate);
    router.delete("/:id", round.delete);
    app.use('/api/round', router);
};