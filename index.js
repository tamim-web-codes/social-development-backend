import express from 'express'
import cors from 'cors'
import { MongoClient, ObjectId } from 'mongodb';
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
const JoindeCollection = db.collection('joinde-events')


app.post('/add-create-events', async (req, res) => {
    const data = req.body;
    const result = await CreateEventsCollection.insertOne(data)
    console.log(result);
    res.send(result)

})

app.get('/explore-event', async (req, res) => {

    try {
        const today = new Date().toISOString().split('T')[0];

        const result = await CreateEventsCollection
            .find({
                date: { $gte: today }
            })
            .sort({ date: 1 })
            .toArray();

        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: 'Failed to fetch events'
        });
    }
});

app.get('/explore-event/:id', async (req, res) => {
    const { id } = req.params;
    const result = await CreateEventsCollection.findOne({ _id: new ObjectId(id) })
    res.send(result)
})

app.get('/manage-my-events/:email', async (req, res) => {
    const email = req.params.email;
    const result = await CreateEventsCollection.find({ email: email }).toArray()
    res.send(result)
})

app.patch('/manage-my-events/:id', async (req, res) => {
    const { id } = req.params
    const data = req.body;
    const result = await CreateEventsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: data }
    )
    res.send(result)

})

app.delete('/manage-my-events/:id', async (req, res) => {
    const { id } = req.params;
    const result = await CreateEventsCollection.deleteOne({ _id: new ObjectId(id) })
    res.send(result)
})

app.post('/joinde-events', async (req, res) => {
    const data = req.body
    const result = await JoindeCollection.insertOne(data)
    res.send(result)
    console.log(result);
})

app.get('/joinde-events/:email', async (req, res) => {
    const { email } = req.params

    const result = await JoindeCollection.find({
        userEmail: email
    }).sort({ date: 1 })
        .toArray()
    res.send(result)
    console.log(result);
})

app.get('/recent-upcoming-events', async (req, res) => {
    const result = await CreateEventsCollection.find().limit(6).toArray()
    res.send(result)
})

app.get('/', (req, res) => {
    res.send({ msg: 'server is runnig' })
})

app.listen(PORT, () => {
    console.log(`server is runnig ${PORT}`);
})


// http://localhost:5000/explore-event