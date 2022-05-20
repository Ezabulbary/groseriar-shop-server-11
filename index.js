const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ytitr.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const categoriesCollection = client.db('groseriarShop').collection('categories');
        const itemsCollection = client.db('groseriarShop').collection('items');

        console.log('Database connected')

        // categories API
        app.get('/categories', async (req, res) => {
            const query = {};
            const cursor = categoriesCollection.find(query);
            const categories = await cursor.toArray();
            res.send(categories)
        });


        // get items API
        app.get('/items', async (req, res) => {
            const query = {};
            const cursor = itemsCollection.find(query);
            const items = await cursor.toArray();
            res.send(items)
        });

        app.get('/items/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: id };
            const item = await itemsCollection.findOne(query);
            res.send(item);
        });

        // Post items DB
        app.post('/items', async (req, res) =>{
            const newItem = req.body;
            const result = await itemsCollection.insertOne(newItem);
            res.send(result);
        })

        // Delete items API
        app.delete('/items/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: id};
            const result = await itemsCollection.deleteOne(query);
            res.send(result);
        })

    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('server side connected!!')
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})