const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 4000;
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qvlwz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run () {
    try{
        await client.connect();
        console.log('connect to database')

        const database = client.db('travellyGo');
        const travellyCollection = database.collection('booking');

        
        // POST API 
        app.post('/services', async(req, res) => {
            const booking = req.body
            console.log('hit the post api', booking)
            const result = await travellyCollection.insertOne(booking);
            console.log(result)
            res.send(result)

        })
        
        // GET API 
        app.get('/services', async (req, res) => {
            const cursor = travellyCollection.find({});
            const booking = await cursor.toArray();
            res.send(booking)
        })
          // GET SINGLE SERVICES 
          app.get('/services/:id', async (req, res) => {
             const id = req.params.id;
             console.log('hit id', id)
             const query = {_id: ObjectId(id)};
             const booking = await travellyCollection.findOne(query);
             res.json(booking)
          })
    
    }


    finally{
        //    await client.close();
       }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Running TravellyGo Server')
})


app.listen(port, () => {
    console.log('Running TravellyGo Server on port', port)
})
