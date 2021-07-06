const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const nocache = require("nocache");
const helmet = require("helmet");
const dotenv = require("dotenv").config();

const userRoutes = require("./routes/user");
const sauceRoutes = require("./routes/sauce");

process.env.MONGO_URI =
  "mongodb+srv://AdminEdit:adminedit@cluster0.nn7v9.mongodb.net/sopekocko?retryWrites=true&w=majority";
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

const app = express();

app.use(
  cors({
    origin: "http://localhost:4200",
  })
);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.use(express.json());

app.use(helmet());

app.use(nocache());

app.use("/img", express.static(path.join(__dirname, "img")));

app.use("/api/sauces", sauceRoutes);
app.use("/api/auth", userRoutes);

module.exports = app;
