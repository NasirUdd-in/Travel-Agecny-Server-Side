const express = require('express');
const { MongoClient } = require('mongodb');
const objectId = require('mongodb').objectId;
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

//middlware
app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://nasirforyou:01521211058@cluster0.rgaly.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        console.log('Database Connected');

        const database = client.db('myTour');
        const servicesCollection = database.collection('services');
        const ordersCollection = database.collection('orders');

        // Get API
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })
        app.get('/orders', async (req, res) => {
            const cursor = ordersCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        //Get Single Service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific id', id);
            const query = { _id: ObjectId(id) }
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })

        app.get('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const order = await ordersCollection.findOne(query);
            console.log('load orders with id', id);
            res.send(order)
        })

        //Post API

        app.post('/services', async (req, res) => {

            const service = req.body;
            console.log('hit the post api', service);
            const result = await servicesCollection.insertOne(service);


            console.log(result);
            res.json(result);
        })

        app.post('/orders', async (req, res) => {

            const service = req.body;
            console.log('hit the post api', service);
            const result = await ordersCollection.insertOne(service);


            console.log(result);
            res.json(result);
        })
        //UPDATE API

        app.put('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const updatedStatus = req.body;
            console.log('updating user', req);
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: updatedStatus.status
                },
            };
            const result = await ordersCollection.updateOne(filter, updateDoc, options)

            res.json(result)
        })

        // Delete API

        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
            res.json(result)
        })

    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', async (req, res) => {
    res.send("Travel Agencyt server running");
})
app.listen(port, () => {
    console.log("Travel Agency server port :", port)
})