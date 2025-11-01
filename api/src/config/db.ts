// Cấu hình (database, biến môi trường, ...)


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://ngduyquangnhat03_db_user:fiteL9eWQRffUw6r@cluster0-knaht.pscwnxt.mongodb.net/?appName=Cluster0-KNaht";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

