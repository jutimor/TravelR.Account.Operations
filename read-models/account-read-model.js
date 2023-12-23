require('dotenv').config();
const { MongoClient  } = require("mongodb");

class AccountReadModel {
    async update(account)
    {
        const client = new MongoClient(process.env.DB_CONN);
        await client.connect();
        const dbName = "Travelr";
        const collectionName = "accounts";
        const database = client.db(dbName);
        const collection = database.collection(collectionName); 

        try {
            const filter = { _id: account.id };

            const result = collection.replaceOne(filter, {...account}, { upsert: true});
            return result;
        } catch (err) {
            console.error(`Something went wrong trying to find the documents: ${err}\n`);
        }
    }

}

module.exports = { AccountReadModel }