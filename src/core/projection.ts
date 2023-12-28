
import dotenv from "dotenv";

import { MongoClient } from "mongodb" 

dotenv.config();
let mongoDbConnexionString : string;
if (!process.env.PROJECTION_DB_CONN)
{
    throw Error("No Mongo connexion string");
}
mongoDbConnexionString = process.env.PROJECTION_DB_CONN;

export const updateDocument = async (account: any) => {
    const client = new MongoClient(mongoDbConnexionString);
    await client.connect();
    const dbName = "Travelr";
    const collectionName = "Accounts";
    const database = client.db(dbName);
    const collection = database.collection(collectionName);

    try {
        console.log(account);
        const filter = { _id: account._accountId };
        // const result = await collection.findOne(filter, {...account});

        // if (result) {
        //     await collection.updateOne(filter, {...account});
        // } else {
        //     await collection.insertOne(filter, {...account});
        // }
        const result = collection.replaceOne(filter, {  ...account}, { upsert: true});

        return result;
    } catch (err) {
        console.error(`Something went wrong trying to find the documents: ${err}\n`);
    }
}


export const  loadAccounts = async () => {
    const client = new MongoClient(mongoDbConnexionString);
    await client.connect();
    const dbName = "Travelr";
    const collectionName = "Accounts";
    const database = client.db(dbName);
    const collection = database.collection(collectionName);

    const findQuery = { 
        
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

module.exports = { updateDocument , loadAccounts}