const express = require("express");
require("dotenv").config();

const mongodb = require("./data/database");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const app = express();

const port = process.env.PORT || 3000;


app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Z-Key"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  next();
});

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
