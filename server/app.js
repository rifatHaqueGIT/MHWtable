const express = require('express');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = 3001;
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.ynihqgb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const dbn = "MHW";
const coll = "Physiology";
const cors = require('cors');
const corsOptions = {
    origin: 'https://localhost:3000',//(https://your-client-app.com)
    optionsSuccessStatus: 200,
};
app.use(cors());

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});



app.get('/api/data', async (req, res) => {
    const queryName = req.query.name;

    if (!queryName) {
        return res.status(400).json({ error: 'Query name is required' });
    }
    try {
        await client.connect();
        await client.db("admin").command({ ping: 1 });
        const db = client.db(dbn);
        const collection = db.collection(coll);

        // Fetch all documents
        const documents = await collection.find({ level_0: queryName }).toArray();
        res.json(documents);
    } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).json({ error: 'An error occurred while fetching data' });
    } finally {
        await client.close();
    }
});

app.get('/api/monsterlist', async (req, res) => {
    const uniqueNamesAggregation = [
        {
            $group: {
                _id: "$level_0", // Group by the 'name' field
                document: { $first: "$$ROOT" } // Get the first document for each unique name
            }
        },
        {
            $replaceRoot: { newRoot: "$document" } // Replace the root with the original document
        }
    ];
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        console.log('Connected successfully to MongoDB');
        const mycollection = client.db(dbn).collection(coll);
        const results = await mycollection.aggregate(uniqueNamesAggregation).toArray();
        const uniqueNames = results.map(doc => doc.level_0);
        res.json(uniqueNames);

    } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).json({ error: 'An error occurred while fetching data' });
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});


// async function run() {
//     const uniqueNamesAggregation = [
//         {
//             $group: {
//                 _id: "$level_0", // Group by the 'name' field
//                 document: { $first: "$$ROOT" } // Get the first document for each unique name
//             }
//         },
//         {
//             $replaceRoot: { newRoot: "$document" } // Replace the root with the original document
//         }
//     ];
//     try {
//         // Connect the client to the server	(optional starting in v4.7)
//         await client.connect();
//         console.log('Connected successfully to MongoDB');
//         const mycollection = client.db(dbn).collection(coll);
//         const results = await mycollection.aggregate(uniqueNamesAggregation).toArray();
//         results.forEach((mon) => {
//             console.log(mon.level_0);
//         });

//     } finally {
//         // Ensures that the client will close when you finish/error
//         await client.close();
//     }
// }

// run().catch(console.dir);