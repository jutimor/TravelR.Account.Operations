require('dotenv').config();
const { MongoClient  } = require("mongodb");

async function publishEvent(event) {
    const client = new MongoClient(process.env.DB_CONN);
    await client.connect();
    const dbName = "Travelr";
    const collectionName = "events";
    const database = client.db(dbName);
    const collection = database.collection(collectionName);

    try {
        const result = collection.insertOne({...event});
        return result;
    } catch (err) {
        console.error(`Something went wrong trying to find the documents: ${err}\n`);
    }
}

async function loadEvents(aggregateId) {
    const client = new MongoClient(process.env.DB_CONN);
    await client.connect();
    const dbName = "Travelr";
    const collectionName = "events";
    const database = client.db(dbName);
    const collection = database.collection(collectionName);

    const findQuery = { 
        'data.id' : aggregateId
    };

    try {
        const cursor = collection.find(findQuery).sort({ time: 1 });

        var list = []
        for await (const doc of cursor) {
            list.push(doc);
        }

    } catch (err) {
        console.error(`Something went wrong trying to find the documents: ${err}\n`);
    }

    await client.close();

    return list;
}

module.exports = { publishEvent , loadEvents}