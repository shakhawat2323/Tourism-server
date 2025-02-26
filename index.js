const express = require("express");
require("dotenv").config();
j;
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;
let jwt = require("jsonwebtoken");

app.use(express.json());
app.use(cors());
// turijamonaaaaa423423

// AFCAvcAqNXtXb64p
const uri = `mongodb+srv://turijamonaaaaa423423:AFCAvcAqNXtXb64p@cluster0.uvwcv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
const PackagesCollacetion = client.db("Tourism").collection("Packages");
const guidesCollacetion = client.db("Tourism").collection("guides");
const userCollacetion = client.db("Tourism").collection("user");
const AddstoriseCollacetion = client.db("Tourism").collection("addstories");
const BookingCollacetion = client.db("Tourism").collection("booking");

// app.post("/jwt", async (req, resvar jwt = require("jsonwebtoken");) => {
//   const user = req.body;
//   const token = jwt.sign(user, process.env.TOKEN, { expiresIN: "1h" });
//   res.send({ token });
// });
app.post("/jwt", async (req, res) => {
  const user = req.body;
  const token = jwt.sign(user, process.env.TOKENS, { expiresIn: "20h" });
  res.send({ token });
});

const verifyAdmin = async (req, res, next) => {
  const email = req.user?.email;
  const query = { email };
  const result = await userCollacetion.findOne(query);
  if (!result || result?.role !== "admin") {
    return res
      .status(403)
      .send({ message: "Forbidden Access ! Adimin Only Actiones" });
    next();
  }
};
const verifyTourist = async (req, res, next) => {
  const email = req.user?.email;
  const query = { email };
  const result = await userCollacetion.findOne(query);
  if (!result || result?.role !== "Tourist") {
    return res
      .status(403)
      .send({ message: "Forbidden Access ! Adimin Only Actiones" });
    next();
  }
};
const verifyGuide = async (req, res, next) => {
  const email = req.user?.email;
  const query = { email };
  const result = await userCollacetion.findOne(query);
  if (!result || result?.role !== "guide") {
    return res
      .status(403)
      .send({ message: "Forbidden Access ! Adimin Only Actiones" });
    next();
  }
};

app.get("/deshbords", async (req, res) => {
  const Admincollection = await userCollacetion.countDocuments({
    role: "admin",
  });
  const Guidecollection = await userCollacetion.countDocuments({
    role: "guide",
  });
  const Touristcollection = await userCollacetion.countDocuments({
    role: "Tourist",
  });
  const usercollection = await userCollacetion.estimatedDocumentCount();
  const packagesCollacetion =
    await PackagesCollacetion.estimatedDocumentCount();
  const GuidesCollacetion = await guidesCollacetion.estimatedDocumentCount();
  const addstoriseCollacetion =
    await AddstoriseCollacetion.estimatedDocumentCount();
  const bookingCollacetion = await BookingCollacetion.estimatedDocumentCount();
  const bookingpriceCollacetion = await BookingCollacetion.aggregate([
    {
      $group: {
        _id: null,
        totalbooking: { $sum: "$price" },
        totalbokingorder: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
  ]).next();
  res.send({
    Admincollection,
    Guidecollection,
    Touristcollection,
    usercollection,
    packagesCollacetion,
    GuidesCollacetion,
    addstoriseCollacetion,
    bookingCollacetion,
    ...bookingpriceCollacetion,
  });
});

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
app.get("/usrs/:email", async (req, res) => {
  const email = req.params.email;
  const query = { email };
  const result = await userCollacetion.findOne(query);
  res.send(result);
});

app.get("/user/:email", async (req, res) => {
  const email = req.params.email;
  const query = { email: { $ne: email } };

  const result = await userCollacetion.find(query).toArray();
  res.send(result);
});

app.get("/usrs/role/:email", async (req, res) => {
  const email = req.params.email;
  const result = await userCollacetion.findOne({ email });
  console.log(result);
  res.send({ role: result?.role });
});
app.patch("/usrs/role/:email", async (req, res) => {
  const email = req.params.email;
  const filter = { email };
  const updateDoc = {
    $set: { role: "guide", status: "Verified" },
  };
  const result = await userCollacetion.updateOne(filter, updateDoc);

  res.send(result);
});
app.patch("/usrs/roles/:email", async (req, res) => {
  const email = req.params.email;
  const filter = { email };
  const updateDoc = {
    $set: { role: "Tourist", status: "Rejected" },
  };
  const result = await userCollacetion.updateOne(filter, updateDoc);

  res.send(result);
});

app.post("/usrs/:email", async (req, res) => {
  const email = req.params.email;
  const qurey = { email };
  const user = req.body;
  const isexist = await userCollacetion.findOne(qurey);
  console.log(isexist);
  if (isexist) {
    return res.send(isexist);
  }
  const result = await userCollacetion.insertOne({
    ...user,
    role: "Tourist",
    time: Date.now(),
  });
  console.log(result);
  res.send(result);
});

app.patch("/user/:email", async (req, res) => {
  const email = req.params.email;
  const { country, specialty, regions, experience, quote, description } =
    req.body;
  console.log(req.body);

  const filter = { email: email };
  console.log(email);
  console.log(filter);
  const updateDoc = {
    $set: {
      country,
      specialty,
      regions,
      experience,
      quote,
      description,
      status: "Requested",
    },
  };
  console.log(updateDoc);

  const result = await userCollacetion.updateOne(filter, updateDoc, {
    upsert: true,
  });
  res.send(result);
});

app.get("/users/guides", async (req, res) => {
  const guides = await userCollacetion.find({ role: "guide" }).toArray();
  res.send(guides);
});

app.post("/booking", async (req, res) => {
  const booking = req.body;
  const result = await BookingCollacetion.insertOne(booking);
  console.log(result);
  res.send(result);
});

app.get("/booking/:email", async (req, res) => {
  const email = req.params.email;
  console.log(email);
  const qurey = { email: email };
  console.log(qurey);

  const result = await BookingCollacetion.find(qurey).toArray();
  console.log(result);
  res.send(result);
});

app.get("/guidebooking/:email", async (req, res) => {
  const email = req.params.email;
  console.log(email);
  const query = { guideemail: email };
  const result = await BookingCollacetion.find(query).toArray();
  console.log(result);

  res.send(result);
});

app.get("/bookings/:id", async (req, res) => {
  const id = req.params.id;

  const query = { _id: new ObjectId(id) };

  const result = await BookingCollacetion.findOne(query);

  res.send(result);
});
// app.delete("/booking/:id", async (req, res) => {
//   const id = req.params.id;
//   const qurey = { _id: new ObjectId(id) };

//   const result = await BookingCollacetion.deleteOne(qurey);
//   res.send(result);
// });
app.delete("/guidebooking/:id", async (req, res) => {
  const id = req.params.id;

  const query = { _id: new ObjectId(id) };
  const result = await BookingCollacetion.deleteOne(query);
  res.send(result);
});

//coppy
app.post("/addstory", async (req, res) => {
  const story = req.body;

  console.log(story);
  const result = await AddstoriseCollacetion.insertOne(story);
  console.log(result);
  res.send(result);
});
app.get("/story", async (req, res) => {
  const result = await AddstoriseCollacetion.find().toArray();
  res.send(result);
});
app.get("/addstory/:email", async (req, res) => {
  const email = req.params.email;
  const qurey = { "userss.email": email };
  const resutl = await AddstoriseCollacetion.find(qurey).toArray();
  res.send(resutl);
});
app.get("/addstory/:id", async (req, res) => {
  const id = req.params.id;
  const qurey = { _id: new ObjectId(id) };
  const resutl = await AddstoriseCollacetion.findOne(qurey);
  res.send(resutl);
});
app.delete("/addstory/:id", async (req, res) => {
  const id = req.params.id;
  const qurey = { _id: new ObjectId(id) };
  const result = await AddstoriseCollacetion.deleteOne(qurey);
  res.send(result);
});

app.get("/packages/:id", async (req, res) => {
  const id = req.params.id;
  const data = { _id: new ObjectId(id) };
  const result = await PackagesCollacetion.findOne(data);

  res.send(result);
});

app.get("/users/guides/:id", async (req, res) => {
  const guideId = req.params.id;
  const guide = await userCollacetion.findOne({
    _id: new ObjectId(guideId),
    role: "guide",
  });
  res.send(guide);
});

app.post("/packages", async (req, res) => {
  const packag = req.body;
  const result = await PackagesCollacetion.insertOne(packag);
  res.send(result);
});
app.get("/package", async (req, res) => {
  const result = await PackagesCollacetion.find().toArray();
  res.send(result);
});

app.listen(port, () => {
  console.log("server is runing but ");
});
