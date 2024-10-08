const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_USERPASSWORD}@knight-cluster.bypaq.mongodb.net/?retryWrites=true&w=majority&appName=knight-cluster`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const memberCollection = client.db("membersDB").collection("members");

    // members api
    app.get("/members", async (req, res) => {
      const corsur = memberCollection.find();
      const result = await corsur.toArray();
      res.send(result);
    });

    app.get("/members/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await memberCollection.findOne(query);
      res.send(result);
    });

    app.post("/members", async (req, res) => {
      const member = req.body;
      const result = await memberCollection.insertOne(member);
      res.send(result);
    });

    app.put("/members/:id", async (req, res) => {
      const id = req.params.id;
      const update = req.body;
      const filter = { _id: new ObjectId(id) };
      const updatedMember = {
        $set: {
          name: update.name,
          email: update.email,
        },
      };
      const result = await memberCollection.updateOne(filter, updatedMember);
      res.send(result);
    });

    app.delete("/members/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await memberCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// initial
app.get("/", (req, res) => {
  res.send("Member list server is runing");
});

app.listen(port, () => {
  console.log(`Member list server is runing on port: ${port}`);
});
