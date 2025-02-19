const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const uri =
  "mongodb+srv://turijamonaaaaa423423:AFCAvcAqNXtXb64p@cluster0.uvwcv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
const PackagesCollacetion = client.db("Tourism").collection("Packages");
const guidesCollacetion = client.db("Tourism").collection("guides");

app.get("/", (req, res) => {
  res.send("server is raning ");
});
app.get("/packages", async (req, res) => {
  const result = await PackagesCollacetion.find().toArray();
  res.send(result);
});

app.get("/guides", async (req, res) => {
  const resutl = await guidesCollacetion.find().toArray();
  res.send(resutl);
});

app.get("/packages/:id", async (req, res) => {
  const id = req.params.id;
  const data = { _id: new ObjectId(id) };
  const result = await PackagesCollacetion.findOne(data);

  res.send(result);
});

app.get("/guides/:id", async (req, res) => {
  const id = req.params.id;
  const qurey = { _id: new ObjectId(id) };
  const result = await guidesCollacetion.findOne(qurey);
  res.send(result);
});

app.listen(port, () => {
  console.log("server is runing but ");
});
