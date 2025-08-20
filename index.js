require('dotenv').config();
const express=require('express');
const cors=require('cors');
const app=express();
const port=process.env.PORT || 3000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.TASK_USER}:${process.env.TASK_PASS}@cluster0.hota77b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

app.get('/',(req,res)=>{
  res.send('assignment-10-server in running')
});


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
    
    const taskCollection=client.db('taskdb').collection('task');
    
    app.get('/task',async(req,res)=>{
      const result=await taskCollection.find().toArray();
      res.send(result);
    })

    app.get('/task/:id',async(req,res)=>{
    const id=req.params.id;
    const query={_id:new ObjectId(id)};
    const result=await taskCollection.findOne(query);
    res.send(result)
    })

    app.post('/task',async(req,res)=>{
      const taskData=req.body;
      const result=await taskCollection.insertOne(taskData);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port,()=>{
    console.log(`assignment server is running on port ${port}`)
});