const { MongoClient,  ObjectId  } = require("mongodb");
require('dotenv').config();

async function getAccounts() {

    const client = new MongoClient(process.env.DB_CONN);
    await client.connect();
    const dbName = "Travelr";
    const collectionName = "accounts";
    const database = client.db(dbName);
    const collection = database.collection(collectionName);

    const findQuery = { 
        // prepTimeInMinutes: { $lt: 45 } 
    };

    try {
        const cursor = collection.find(findQuery);//.sort({ name: 1 });

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

async function addAccount(account) {
    const client = new MongoClient(process.env.DB_CONN);
    await client.connect();
    const dbName = "Travelr";
    const collectionName = "accounts";
    const database = client.db(dbName);
    const collection = database.collection(collectionName);

    const findQuery = { 
        // prepTimeInMinutes: { $lt: 45 } 
    };

    try {
        const result = collection.insertOne (account);//.sort({ name: 1 });
        
        return result;
    } catch (err) {
        console.error(`Something went wrong trying to find the documents: ${err}\n`);
    }
}




async function updateAccount(accountId, account) {
    const client = new MongoClient(process.env.DB_CONN);
    await client.connect();
    const dbName = "Travelr";
    const collectionName = "accounts";
    const database = client.db(dbName);
    const collection = database.collection(collectionName);

    const query = {"_id": new ObjectId(accountId)}
    const options = { upsert: false };
    delete account['_id']
    const updateDoc = {
        $set: account,
      };

    try {
        const result = collection.updateOne(query, updateDoc , options);
        
        return result;
    } catch (err) {
        console.error(`Something went wrong trying to find the documents: ${err}\n`);
    }
}

async function deleteAccount(accountId) {
    const client = new MongoClient(process.env.DB_CONN);
    await client.connect();
    const dbName = "Travelr";
    const collectionName = "accounts";
    const database = client.db(dbName);
    const collection = database.collection(collectionName);

    
    const query = {"_id": new ObjectId(accountId)}

    try {
        const result = await collection.deleteOne(query);
        return result;
    } catch (err) {
        console.error(`Something went wrong trying to find the documents: ${err}\n`);
    }
}

async function getOperations() {
    const client = new MongoClient(process.env.DB_CONN);
    await client.connect();
    const dbName = "Travelr";
    const collectionName = "operations";
    const database = client.db(dbName);
    const collection = database.collection(collectionName);

    const findQuery = { 
        // prepTimeInMinutes: { $lt: 45 } 
    };

    try {
        const cursor = collection.find(findQuery);//.sort({ name: 1 });

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

module.exports = { getAccounts, addAccount,  updateAccount, updateAccount, deleteAccount, getOperations }