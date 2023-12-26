require('dotenv').config();

const { HTTP } = require("cloudevents");
const express = require("express");

const { CloudEvent, Account, Operation } = require('./events.js');

const app = express();
var cors = require('cors');
const { AccountAggregate } = require('./aggregates/account-aggregate.js');
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


// // Declare a route
// app.get('/accounts', async (req, res) => {
//     res.send(await getAccounts());
// })



app.get('/account', async (req, res) => {

    const aggregate = new AccountAggregate(req.query.aggregateId);
    await aggregate.init();
    await aggregate.setState();
    res.send(await aggregate.state);
});

app.post('/account', 
    async (req, res) => { 
        const object = JSON.parse(req.body); 
        const receivedEvent = HTTP.toEvent({ headers: req.headers, body: req.body });
         
        try {

            const parsedCloudEvent = await CloudEvent.validateAsync(object);

            if (parsedCloudEvent.type == 'travelr.account.opened'){
                
                _ = await Account.validateAsync(parsedCloudEvent.data);
            }

            
        } catch (err) {
            console.log('err',  err)
            res.send(err);
            return;
        } 
        
        
        const aggregate = new AccountAggregate(receivedEvent.data.id);
        await aggregate.init();
        await aggregate.setState();
        if (receivedEvent.type == 'travelr.account.opened')
        {
            await aggregate.openAccount(receivedEvent)
        } 
        else 
        {
            await aggregate.addOperation(receivedEvent)
        }
    res.send(await aggregate.state);
})


app.listen(process.env.PORT, () => {
    console.log(`TravelR app listening on port ${process.env.PORT}`);
  });