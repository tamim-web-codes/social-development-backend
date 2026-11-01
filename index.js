import express from 'express'
import cors from 'cors'
import { MongoClient } from 'mongodb';
import 'dotenv/config'
const app = express()
const PORT = 5000


app.use(express.json())
app.use(cors())



const client = new MongoClient(process.env.MONGODB_URI);

export async function connectToMongoDB() {
    try {
        await client.connect();
        console.log("You successfully connected to MongoDB!");
        return client;
    } catch (err) {
        console.dir(err);
    }
}
const mongoclient = await connectToMongoDB()
const db = mongoclient.db('social-event')
const CreateEventsCollection = db.collection('add-event')
const BookingCollection = db.collection('booking')


app.post('/add-create-events',async (req, res) => {
   const data = req.body;
   const result = await CreateEventsCollection.insertOne(data)
   console.log(result);
   res.send(result)

})

app.get('/')

app.get('/', (req, res) => {
    res.send({ msg: 'server is runnig' })
})

app.listen(PORT, () => {
    console.log(`server is runnig ${PORT}`);
})


