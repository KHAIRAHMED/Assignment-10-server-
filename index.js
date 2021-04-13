const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@clusteraristocracy.y3wqn.mongodb.net/Khair?retryWrites=true&w=majority`;

const app = express();

app.use(bodyParser.json());
app.use(cors());

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const productCollection = client.db("productDB").collection("productInfo");

  app.post("/addProducts", (req, res) => {
    const info = req.body;

    console.log("info", info);

    productCollection.insertOne(info).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });
  app.get("/getProducts", (req, res) => {
    productCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });
  app.delete("/delete/:id", (req, res) => {
    console.log(req.params.id);
    productCollection
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => {
        res.send(result.deletedCount > 0);
      });
  });
});

const port = 5000;

app.get("/", (req, res) => {
  res.send("Hello World....!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
