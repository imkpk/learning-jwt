require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const AuthRoute = require("./routes/Auth/auth");

const app = express();

app.use(express.json());
app.use("/", AuthRoute);



// const { MongoClient } = require('mongodb');
// const uri = process.env.MONGO_URI
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`listening on http://localhost:${PORT}`));

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connected to mongo database"))
  .catch((e) => console.error(e));