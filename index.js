const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const cors = require("cors")

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.l9l3g.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log(uri)
async function run() {

    try {
        await client.connect();
        const database = client.db("foodDelivery")
        const orderCollection = database.collection('orders')
        const servicesCollection = database.collection('services')

        console.log("database connected successfully")

        //Post API 

        app.post("/addProducts", async (req, res) => {
            const service = req.body;

            const result = await servicesCollection.insertOne(service)
            res.send(result)
            console.log(result)
        })

        // get api
        app.get("/services", async (req, res) => {
            const service = await servicesCollection.find({}).toArray();
            res.send(service)
        })

        // get single product  
        app.get("/services/:id", async (req, res) => {
            const id = req.params.id;
            console.log("getting id ", id);
            const query = { _id: ObjectId(id) }
            const result = await servicesCollection.findOne(query)
            res.send(result)

        })


    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir)


app.get('/', (req, res) => {
    res.send("Hello mongodb")
})



app.listen(port, (req, res) => {
    console.log('server running with port', port)
})