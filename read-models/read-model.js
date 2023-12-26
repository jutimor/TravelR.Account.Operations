require('dotenv').config();
const { MongoClient  } = require("mongodb");

class ReadModel {

    readModelName;
    aggregateId;

    constructor(readModelName, aggregateId) {
        this.readModelName = readModelName;
        this.aggregateId = aggregateId;
    }

    async init() {
        const client = new MongoClient(process.env.DB_CONN);
        await client.connect();
        const dbName = "Travelr";
        const collectionName = this.readModelName;
        const database = client.db(dbName);
        const collection = database.collection(collectionName);
        
        const filter = { _id: this.aggregateId }; 
        const result = await collection.findOne(filter);

        if (result) {
            console.log(result)
            this.aggregateId = result.aggregateId;
            this.name = result.name;
            this.balance = result.balance;
        }
    }

    async update()
    {
        const client = new MongoClient(process.env.DB_CONN);
        await client.connect();
        const dbName = "Travelr";
        const collectionName = this.readModelName;
        const database = client.db(dbName);
        const collection = database.collection(collectionName); 

        try {
            const filter = { _id: this.aggregateId };

            const result = collection.replaceOne(filter, {
                aggregateId: this.aggregateId,
                name: this.name,
                balance : this.balance
            }, { upsert: true});
            return result;
        } catch (err) {
            console.error(`Something went wrong trying to find the documents: ${err}\n`);
        }
    }
}

module.exports = { ReadModel }