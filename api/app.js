const express = require("express");
const { config } = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

const route = require("./routes");

config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(route);

app.use((err, req, res, next) => {
  res.status(err.status || 400).json({
    message: `${err.message}`,
  });
});

const listener = app.listen(
  process.env.API_PORT,
  process.env.API_HOST,
  async () => {
    console.log(
      `SErver is starting at ${listener.address().address}:${
        listener.address().port
      }`
    );
    try {
      await mongoose.connect(process.env.MONGO_URL);
      console.log(`Db successfully connected`);
    } catch (error) {
      console.log(`Error ${error.message}`);
    }
  }
);
