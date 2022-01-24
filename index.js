const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
// import token from "./world-design-official-firebase-adminsdk.json";

const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

// var serviceAccount = require(`./new.json`);
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// Environment Variables
const dbUser = "debojoti";
const dbPassword = "BS7W9XortGhRq8lP";
const uri = `mongodb+srv://${dbUser}:${dbPassword}@cluster0.ocykb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// async function verifyToken(req, res, next) {
//   if (req.headers?.authorization?.startsWith("Bearer ")) {
//     const token = req.headers.authorization.split(" ")[1];

//     try {
//       const decodedUser = await admin.auth().verifyIdToken(token);
//       req.decodedEmail = decodedUser.email;
//       // console.log(req.decodedEmail);
//     } catch {}
//   }
//   next();
// }

async function run() {
  try {
    await client.connect();
    const database = client.db("design-world");
    const designsCollection = database.collection("designs");
    const usersCollection = database.collection("users");
    const savedCollection = database.collection("saved");
    const reviewsCollection = database.collection("reviews");
    const countsCollection = database.collection("counts");
    const coursesCollection = database.collection("courses");

    // POST REVIEWS
    app.post("/reviews", async (req, res) => {
      const newPlan = req.body;
      const result = await reviewsCollection.insertOne(newPlan);
      res.json(result);
    });

    //  GET API FROM REVIEWS
    app.get("/reviews", async (req, res) => {
      const cursor = reviewsCollection.find({});
      const products = await cursor.toArray();
      // console.log(products);
      res.json(products);
    });

    app.get("/courses", async (req, res) => {
      const cursor = coursesCollection.find({});
      const courses = await cursor.toArray();
      res.json(courses);
    });

    app.get("/courses/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await coursesCollection.findOne(query);
      res.json(result);
    });

    app.get("/designs", async (req, res) => {
      const cursor = designsCollection.find({});
      const appointments = await cursor.toArray();
      res.json(appointments);
    });

    app.get("/designs/filter", async (req, res) => {
      const category = req.query.category;
      const cursor = designsCollection.find({ category: category });
      const appointments = await cursor.toArray();
      res.json(appointments);
    });

    app.get("/designs/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await designsCollection.findOne(query);
      res.json(result);
    });

    app.get("/saved", async (req, res) => {
      const cursor = savedCollection.find({});
      const products = await cursor.toArray();
      res.json(products);
    });

    app.get("/saved/desired", async (req, res) => {
      const designPhoto = req.query.designPhoto;
      const query = { designPhoto: designPhoto };
      const cursor = savedCollection.find(query);
      const desired = await cursor.toArray();
      res.json(desired);
    });

    app.delete("/saved/devplan/:id", async (req, res) => {
      const result = await savedCollection.deleteOne({
        _id: ObjectId(req.params.id),
      });
      console.log(req.params.id);
      res.send(result);
    });

    app.post("/designs", async (req, res) => {
      const appointment = req.body;
      const result = await designsCollection.insertOne(appointment);
      res.json(result);
    });

    app.put("/designs/love/:id", async (req, res) => {
      const id = req.params.id;
      const updatedLover = req.body;
      const filter = { _id: ObjectId(id) };
      const updateDoc = {
        $push: { lover: updatedLover.email },
      };
      const options = { upsert: true };
      const result = await designsCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
      console.log(result);
    });

    // app.put("/designs/save/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const updatedLover = req.body;
    //   const options = { upsert: true };
    //   const filter = { _id: ObjectId(id) };
    //   const updateDoc = {
    //     $push: { saves: updatedLover.email },
    //   };
    //   const result = await designsCollection.updateOne(
    //     options,
    //     filter,
    //     updateDoc
    //   );
    //   res.json(result);
    //   console.log(result);
    // });

    app.post("/viewed", async (req, res) => {
      const img = req.body;
      // console.log(img);
      const filter = { img: img };
      const options = { upsert: true };
      const updateDoc = { $inc: { count: 1 } };
      const result = await countsCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
      // console.log(result);
    });

    app.get("/viewed", async (req, res) => {
      const cursor = countsCollection.find({});
      const designs = await cursor.toArray();
      // console.log(products);
      res.json(designs);
    });

    // app.put("/designs/visited", async (req, res) => {
    //   const visited = req.body;
    //   const filter = { _id: ObjectId(visited._id) };
    // });

    // app.put("/designs/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const payment = req.body;
    //   const filter = { _id: ObjectId(id) };
    //   const updateDoc = {
    //     $set: {
    //       payment: payment,
    //     },
    //   };
    //   const result = await designsCollection.updateOne(filter, updateDoc);
    //   res.json(result);
    // });

    // POST API IN Saved
    app.post("/saved", async (req, res) => {
      const newPlan = req.body;
      console.log(newPlan);
      const result = await savedCollection.insertOne(newPlan);
      res.json(result);
    });

    app.get("/saved/query/:email", async (req, res) => {
      const email = req.params.email;
      const cursor = savedCollection.find({ email: email });
      const likes = await cursor.toArray();
      res.json(likes);
    });

    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === "admin") {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    });

    app.get("/users", async (req, res) => {
      const cursor = usersCollection.find();
      const users = await cursor.toArray();
      res.json(users);
    });

    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.json(result);
    });

    app.put("/users", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      console.log(result);
      res.json(result);
    });

    app.put("/users/admin", async (req, res) => {
      const user = req.body;
      const requester = req.decodedEmail;
      if (requester) {
        const requesterAccount = await usersCollection.findOne({
          email: requester,
        });
        if (requesterAccount.role === "admin") {
          const filter = { email: user.email };
          const updateDoc = { $set: { role: "admin" } };
          const result = await usersCollection.updateOne(filter, updateDoc);
          res.json(result);
        }
      } else {
        res
          .status(403)
          .json({ message: "you do not have access to make admin" });
      }
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello Designers world!");
});

app.listen(port, () => {
  console.log(`listening at ${port}`);
});
