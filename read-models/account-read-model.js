
const { ReadModel  } = require("./read-model");

class AccountReadModel extends ReadModel {
    
    name;
    balance = 0;

    constructor(aggregateId) {
        super("accounts", aggregateId)
    }

    async accountOpened(accountOpened) {
        this.aggregateId = accountOpened.id;
        this.name = accountOpened.name;
        this.balance = accountOpened.amount;

        await this.update()
    }

    async operationAdded(operationAdded) {
        this.balance += operationAdded.amount;
        
        await this.update()
    }
}

module.exports = { AccountReadModel }