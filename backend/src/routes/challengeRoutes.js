const router = require("express").Router();

router.get("/", (req, res) => {
  res.send("Challenge route is working");
});

module.exports = router;