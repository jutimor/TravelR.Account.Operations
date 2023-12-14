require('dotenv').config();

const { HTTP } = require("cloudevents");
const { getAccounts, addAccount, updateAccount, deleteAccount, getOperations } = require('./data.js');

const express = require("express");

const { publishEvent } = require('./event-store.js');
const { cloudEvent, Account, Operation } = require('./events.js');

const app = express();
var cors = require('cors');
app.use(cors());


app.use((req, res, next) => {
    let data = "";
  
    req.setEncoding("utf8");
    req.on("data", function (chunk) {
      data += chunk;
    });
  
    req.on("end", function () {
      req.body = data;
      next();
    });
  });


// Declare a route
app.get('/accounts', async (req, res) => {
    return res.send(await getAccounts());
})

app.post("/event", 
    async (req, res) => { 
        const object = JSON.parse(req.body); 
        const receivedEvent = HTTP.toEvent({ headers: req.headers, body: req.body });
        try {

            const parsedCloudEvent = await cloudEvent.validateAsync(object);
            if (parsedCloudEvent.type == 'travelr.account.opened'){
                _ = await Account.validateAsync(parsedCloudEvent.data);
            }

            
        } catch (err) {
            console.log(err)
            res.send(err);
            return;
        } 
        
        console.log('publishEvent')
    res.send( await publishEvent(receivedEvent));
});

app.post('/accounts', 
    async (req, res) => { 
        const object = JSON.parse(req.body); 
        const receivedEvent = HTTP.toEvent({ headers: req.headers, body: req.body });
        try {

            const parsedCloudEvent = await cloudEvent.validateAsync(object);
            console.log(receivedEvent, parsedCloudEvent);
            console.log(parsedCloudEvent.type);

            if (parsedCloudEvent.type == 'travelr.account.opened'){
                
            _ = await Account.validateAsync(parsedCloudEvent.data);
        }

            
        } catch (err) {
            console.log(err)
            res.send(err);
            return;
        } 
        
        console.log('publishEvent')
    res.send( await publishEvent(receivedEvent));
})

app.put('/accounts/:id', async (req, res) => {
    res.send( await updateAccount(request.params.id, request.body));
})

app.delete('/accounts/:id', async (req, res) => {
    res.send( await deleteAccount(request.params.id));
})

app.get('/account/:idAccount/operations', async (req, res) => {
    res.send( await getOperations());
})


app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT}`);
  });