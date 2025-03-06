const express = require("express");
require("dotenv").config();

const mongodb = require("./data/database");
const app = express();

const port = process.env.PORT || 3000;


app.use(express.json());


app.use("/", require("./routes/index"));

mongodb.initDb((err) => {
  if (err) {
    console.error("❌ Database initialization failed:", err);
  } else {
    app.listen(port, () => {
      console.log(`✅ Database is connected & Server is running on port ${port}`);
    });
  }
});
