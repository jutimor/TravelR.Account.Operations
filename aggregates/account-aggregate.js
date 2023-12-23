const { loadEvents, publishEvent } = require("../event-store.js")
const {  CloudEvent, Account, Operation } = require('../events.js');
const { Aggregate  } = require('./aggregrate.js');
const { AccountReadModel } = require('../read-models/account-read-model.js')


// specversion:"1.0",
// type:"travelr.account.operation.validated",
// source:"https://travelr-ui.com",
// id: uuidv4(),
// time: new Date(),
// datacontenttype:"application/json",
// data:{
//     id:'e0972ef9-9893-463f-8736-5df266fd5dba',
//     amount : -15
// }
// }

class AccountAggregate extends Aggregate {
   
    async openAccount(account) {

        if (account) {
            await publishEvent(account);
        }
        
        await this.applyAccountOpened(account);
        const accountReadModel = new AccountReadModel()
        await accountReadModel.update(this.state);
    }

    async addOperation(operation) {
        
        if (operation) {
        await publishEvent(operation);
    }
        await this.applyOperationValidated(operation);
        const accountReadModel = new AccountReadModel()
        await accountReadModel.update(this.state);
    }
    
    async setState() { 
        await super.setState();
        for ( const event of this.events)
        {
            var parsedCloudEvent = {}
            try {
             parsedCloudEvent = await CloudEvent.validateAsync(event, { allowUnknown: true});
            }catch (err) {
                console.error('event format invalid', err);
                continue;
            }

            switch (parsedCloudEvent.type) {
                case 'travelr.account.opened':
                    await this.applyAccountOpened(parsedCloudEvent);
                    break;
                case 'travelr.account.operation.validated':
                    await this.applyOperationValidated(parsedCloudEvent);
                    break;
                default:
                    break;
            }
        }
    } 

    async applyAccountOpened(cloudEvent) {
        try {
            await Account.validateAsync(cloudEvent.data);
            this.state = { ...this.state, ...cloudEvent.data};
        } catch (err) {
            console.error('account opened event format invalid')
        }
    }

    async applyOperationValidated(cloudEvent) {
        try {
            await Operation.validateAsync(cloudEvent.data);
            this.state.amount += cloudEvent.data.amount;
            if (!this.state.history) {
                this.state.history = []
            }
            this.state.history.push(cloudEvent.data)
        } catch (err) {
            console.error(err)
        }
    }
}

module.exports = {  AccountAggregate }