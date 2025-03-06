const router = require("express").Router();

// Root route for testing
// router.get("/", (req, res) => { res.send("Hello World!"); });

router.use("/contacts", require("./contacts"));

module.exports = router;
